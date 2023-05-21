/*
 * Created with @iobroker/create-adapter v2.4.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { google } from "googleapis";
import { JWT } from "google-auth-library";


// Load your modules here, e.g.:
// import * as fs from "fs";

class GoogleSpreadsheet extends utils.Adapter {

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "google-spreadsheet",
        });
        this.on("ready", this.onReady.bind(this));
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

    private fetchJwt(config: ioBroker.AdapterConfig, message: ioBroker.Message): void{
        const auth = new JWT({
            email: this.config.serviceAccountEmail,
            key: this.config.privateKey,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        });
        const sheets = google.sheets({ version: "v4", auth });

        sheets.spreadsheets.values.append({
            // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
            range: this.config.sheetName,
            spreadsheetId: this.config.spreadsheetId,
            valueInputOption: "USER_ENTERED",
            // Request body metadata
            requestBody: {
                values: prepareValues(message, this.log)
            },
        }).then(() => {
            this.log.info("Data successfully sent to google spreadsheet");
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:"+ error);
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