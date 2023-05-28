/*
 * Created with @iobroker/create-adapter v2.4.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";


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
            if (obj.command === "append") {
                this.log.info("append to spreadsheet");
                this.append(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            } else if (obj.command === "deleteRows") {
                this.log.info("delete rows from spreadsheet");
                this.deleteRows(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            } else if (obj.command === "createSheet") {
                this.log.info("create sheet");
                this.createSheet(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            } else if (obj.command === "deleteSheet") {
                this.log.info("delete sheet");
                this.deleteSheet(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            }else if (obj.command === "duplicateSheet") {
                this.log.info("duplicate sheet");
                this.duplicateSheet(this.config, obj);

                // Send response in callback if required
                if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
            }
        }
    }

    private append(config: ioBroker.AdapterConfig, message: ioBroker.Message): void{
        const sheets = this.init();
        const messageData: Record<string, any> = message.message as Record<string, any>;

        sheets.spreadsheets.values.append({
            // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
            range: messageData["sheetName"],
            spreadsheetId: this.config.spreadsheetId,
            valueInputOption: "USER_ENTERED",
            // Request body metadata
            requestBody: {
                values: this.prepareValues(messageData["data"])
            },
        }).then(() => {
            this.log.info("Data successfully sent to google spreadsheet");
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:"+ error);
        });

    }

    private prepareValues(message: any) : any{
        if (Array.isArray(message)){
            this.log.info("is Array");
            return [message];

        } else {
            this.log.info("Message: "+ JSON.stringify(message));
            return [[message]];
        }

    }

    private deleteRows(config: ioBroker.AdapterConfig, message: ioBroker.Message): void {
        this.log.info("Message: " + JSON.stringify(message));
        const sheets = this.init();

        const messageData: Record<string, any> = message.message as Record<string, any>;

        sheets.spreadsheets.get({spreadsheetId: this.config.spreadsheetId}).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title == messageData["sheetName"]);
                if (sheet && sheet.properties) {
                    const sheetId = sheet.properties.sheetId;
                    sheets.spreadsheets.batchUpdate(
                        {
                            spreadsheetId: this.config.spreadsheetId,
                            requestBody: {
                                requests: [{
                                    deleteDimension: {
                                        range: {
                                            dimension: "ROWS",
                                            endIndex: messageData["end"],
                                            sheetId: sheetId,
                                            startIndex: messageData["start"]-1
                                        }

                                    }
                                }]
                            }
                        }

                    ).then(() => {
                        this.log.info("Rows successfully deleted from google spreadsheet");
                    }).catch(error => {
                        this.log.error("Error while deleting rows from Google Spreadsheet:" + error);
                    });
                }
            }
        });


    }

    private init(): sheets_v4.Sheets{
        const auth = new JWT({
            email: this.config.serviceAccountEmail,
            key: this.config.privateKey,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        });
        return google.sheets({ version: "v4", auth });
    }

    private createSheet(config: ioBroker.AdapterConfig, message: ioBroker.Message): void{
        const sheets = this.init();

        sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
                requests:[{addSheet:{
                    properties:{
                        title: message.message as string
                    }
                }}]
            }
        }).then(() => {
            this.log.info("Sheet created successfully");
        }).catch(error => {
            this.log.error("Error while creating sheet:"+ error);
        });

    }

    private deleteSheet(config: ioBroker.AdapterConfig, message: ioBroker.Message): void {
        const sheets = this.init();

        sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId as string }).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title == message.message);
                if (sheet && sheet.properties) {
                    sheets.spreadsheets.batchUpdate({
                        spreadsheetId: this.config.spreadsheetId,
                        requestBody: {
                            requests: [{
                                deleteSheet: {
                                    sheetId: sheet.properties.sheetId
                                }
                            }]
                        }
                    }).then(() => {
                        this.log.info("Data successfully sent to google spreadsheet");
                    }).catch(error => {
                        this.log.error("Error while sending data to Google Spreadsheet:" + error);
                    });
                }
            }
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
        });


    }

    private duplicateSheet(config: ioBroker.AdapterConfig, message: ioBroker.Message): void {
        const sheets = this.init();
        const messageData: Record<string, any> = message.message as Record<string, any>;

        sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId as string }).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title == messageData["source"]);
                if (sheet && sheet.properties) {
                    sheets.spreadsheets.batchUpdate({
                        spreadsheetId: this.config.spreadsheetId,
                        requestBody: {
                            requests: [{
                                duplicateSheet: {
                                    sourceSheetId: sheet.properties.sheetId,
                                    newSheetName: messageData["target"],
                                    insertSheetIndex: spreadsheet.data.sheets.length
                                }
                            }]
                        }
                    }).then(() => {
                        this.log.info("Data successfully sent to google spreadsheet");
                    }).catch(error => {
                        this.log.error("Error while sending data to Google Spreadsheet:" + error);
                    });
                } else {
                    this.log.warn("Cannot find sheet: " + messageData["source"]);
                }
            }
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
        });


    }
}


if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new GoogleSpreadsheet(options);
} else {
    // otherwise start the instance directly
    (() => new GoogleSpreadsheet())();
}