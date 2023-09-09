/*
 * Created with @iobroker/create-adapter v2.4.0
 */




import * as utils from "@iobroker/adapter-core";

import fs from "fs";
import { SpreadsheetUtils } from "./lib/google";


class GoogleSpreadsheet extends utils.Adapter {

    private spreadsheet: SpreadsheetUtils;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: "google-spreadsheet",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.spreadsheet = new SpreadsheetUtils(this.config, this.log);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.debug("config spreadsheetId: " + this.config.spreadsheetId);
        this.spreadsheet = new SpreadsheetUtils(this.config, this.log);

    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {

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
            switch (obj.command) {
                case "append": {
                    this.log.debug("append to spreadsheet");
                    this.append(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                case "deleteRows": {
                    this.log.debug("delete rows from spreadsheet");
                    this.deleteRows(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                case "createSheet": {
                    this.log.debug("create sheet");
                    this.createSheet(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                case "deleteSheet": {
                    this.log.debug("delete sheet");
                    this.deleteSheet(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                case "duplicateSheet": {
                    this.log.debug("duplicate sheet");
                    this.duplicateSheet(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                case "upload": {
                    this.log.debug("upload file");
                    this.upload(obj);

                    if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
                    break; 
                }
                default: {
                    this.log.warn("unknown command: " + obj.command);
                    break; 
                }
            }
        }
    }

    private upload(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(["source", "target", "parentFolder"], messageData)) {
            return;
        }
        this.spreadsheet.upload(messageData["source"], messageData["target"], messageData["parentFolder"], fs.createReadStream(messageData["source"]));
    }
    private append(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(["sheetName", "data"], messageData)) {
            return;
        }
        this.spreadsheet.append(messageData["sheetName"], messageData["data"]);
    }
    public deleteRows(message: ioBroker.Message): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(["sheetName", "start", "end"], messageData)) {
            return;
        }
        this.spreadsheet.deleteRows(messageData["sheetName"], messageData["start"], messageData["end"]);
    }
    public createSheet(message: ioBroker.Message): void {
        this.spreadsheet.createSheet(message.message as string);
    }
    public deleteSheet(message: ioBroker.Message): void {
        this.spreadsheet.deleteSheet(message.message as string);
    }
    public duplicateSheet(message: ioBroker.Message): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(["source", "target", "index"], messageData)) {
            return;
        }
        this.spreadsheet.duplicateSheet(messageData["source"], messageData["target"], messageData["index"]);
    }

    private missingParameters(neededParameters: string[], messageData: Record<string, any>): boolean {

        let result = false;
        for (const parameter of neededParameters) {
            if (Object.keys(messageData).indexOf(parameter) == -1) {
                result = true;
                this.log.error("The parameter '" + parameter + "' is required but was not passed!");
            }
        }

        return result;
    }

}


if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new GoogleSpreadsheet(options);
} else {
    // otherwise start the instance directly
    (() => new GoogleSpreadsheet())();
}
