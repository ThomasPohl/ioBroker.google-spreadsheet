/*
 * Created with @iobroker/create-adapter v2.4.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import {Auth} from "googleapis";
const request = require('request');

// Load your modules here, e.g.:
// import * as fs from "fs";

class GoogleSpreadsheet extends utils.Adapter {

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "google-spreadsheet",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info("config spreadsheetId: " + this.config.spreadsheetId);
        this.log.info("config sheetName: " + this.config.sheetName);

     
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    private onMessage(obj: ioBroker.Message): void {
        if (typeof obj === "object" && obj.message) {
            if (obj.command === "send") {
                this.log.info("send");
                this.fetchJwt(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            }
        }
    }

    private fetchJwt(config: ioBroker.AdapterConfig, message: ioBroker.Message){
        var jwtClient = new Auth.JWT(
            this.config.serviceAccountEmail,
            undefined,
            this.config.privateKey.split('\\n').join('\n'),
            ['https://www.googleapis.com/auth/spreadsheets']
          );
          
          this.log.info("Fetching jwt");
          const log = this.log;
          // Authentifiziere den Service Account und erhalte ein Zugriffstoken
          jwtClient.authorize(function(err, tokens) {
            if (err) {
              log.error(err.message);
              return;
            }
            if (!tokens){
                return;
            }
            log.info("Successfully fetched jwt");
            var accessToken = tokens.access_token;

            // Sende die Daten an das Google Spreadsheet
            var url = "https://sheets.googleapis.com/v4/spreadsheets/" + config.spreadsheetId + "/values/" + encodeURIComponent(config.sheetName) + ":append?valueInputOption=RAW";
          
            var options = {
              url: url,
              method: "POST",
              headers: {
                Authorization: "Bearer " + accessToken
              },
              json: {
                values: prepareValues(message, log)
              }
            };
            log.info("Appending to spreadsheet: " + JSON.stringify(options));
            request(options, function(error: any, response: any, body: any) {
              if (error) {
                log.error("Fehler beim Senden der Daten an Google Spreadsheet:"+ error);
              } else if (response.statusCode !== 200) {
                log.error("Fehler beim Senden der Daten an Google Spreadsheet. Statuscode:"+ response.statusCode);
              } else {
                log.info("Daten erfolgreich an Google Spreadsheet gesendet");
              }
            });
        });
    }


}

function prepareValues(message: ioBroker.Message, log: ioBroker.Log) : any{
    log.info("Type: " + message.message.constructor.toString());
    if (Array.isArray(message.message)){
        log.info("is Array");
        return [message.message];

    } else {
        log.info("Message: "+ JSON.stringify(message));
        return [[message.message]];
    }

}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new GoogleSpreadsheet(options);
} else {
    // otherwise start the instance directly
    (() => new GoogleSpreadsheet())();
}