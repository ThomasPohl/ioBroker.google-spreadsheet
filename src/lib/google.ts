import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";

export class SpreadsheetUtils {

    public constructor(private config: ioBroker.AdapterConfig, private log: ioBroker.Log) {
    }

    public deleteRows(sheetName:string, start:number, end:number): void {
        const sheets = this.init();

        sheets.spreadsheets.get({spreadsheetId: this.config.spreadsheetId}).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title ==sheetName);
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
                                            endIndex: end,
                                            sheetId: sheetId,
                                            startIndex: start-1
                                        }
                                    }
                                }]
                            }
                        }

                    ).then(() => {
                        this.log.debug("Rows successfully deleted from google spreadsheet");
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

    public createSheet(title: string): void{
        const sheets = this.init();

        sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
                requests:[{addSheet:{
                    properties:{
                        title: title
                    }
                }}]
            }
        }).then(() => {
            this.log.debug("Sheet created successfully");
        }).catch(error => {
            this.log.error("Error while creating sheet:"+ error);
        });

    }



    public duplicateSheet(source: string, target: string, index: number): void {
        const sheets = this.init();


        sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId as string }).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title == source);
                if (sheet && sheet.properties) {
                    let insertIndex = index;
                    if (insertIndex==-1 || insertIndex == undefined){
                        insertIndex = spreadsheet.data.sheets.length;
                    }
                    sheets.spreadsheets.batchUpdate({
                        spreadsheetId: this.config.spreadsheetId,
                        requestBody: {
                            requests: [{
                                duplicateSheet: {
                                    sourceSheetId: sheet.properties.sheetId,
                                    newSheetName: target,
                                    insertSheetIndex: insertIndex
                                }
                            }]
                        }
                    }).then(() => {
                        this.log.debug("Data successfully sent to google spreadsheet");
                    }).catch(error => {
                        this.log.error("Error while sending data to Google Spreadsheet:" + error);
                    });
                } else {
                    this.log.warn("Cannot find sheet: " + source);
                }
            }
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
        });


    }
    public upload(source:string, target:string, parentFolder:string, filecontent:any): void {


        const auth = new JWT({
            email: this.config.serviceAccountEmail,
            key: this.config.privateKey,
            scopes: ["https://www.googleapis.com/auth/drive.file"]
        });
        const driveapi = google.drive({ version: "v3", auth });


        driveapi.files.create({
            requestBody:{
                parents: [parentFolder],
                name: target
            },
            media:{
                mimeType: "application/octet-stream",
                body: filecontent
            },
            fields: "id"
        }).then(() => {
            this.log.debug("Data successfully uploaded to google spreadsheet");
        }).catch(error => {
            this.log.error("Error while uploading data to Google Spreadsheet:" + error);
        });
    }



    public deleteSheet(title: string): void {
        const sheets = this.init();

        sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId as string }).then(spreadsheet => {
            if (spreadsheet && spreadsheet.data.sheets) {
                const sheet = spreadsheet.data.sheets
                    .find(sheet => sheet.properties && sheet.properties.title == title);
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
                        this.log.debug("Data successfully sent to google spreadsheet");
                    }).catch(error => {
                        this.log.error("Error while sending data to Google Spreadsheet:" + error);
                    });
                }
            }
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
        });


    }



    public append(sheetName:string, data:any): void{
        const sheets = this.init();


        sheets.spreadsheets.values.append({
            // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
            range: sheetName,
            spreadsheetId: this.config.spreadsheetId,
            valueInputOption: "USER_ENTERED",
            // Request body metadata
            requestBody: {
                values: this.prepareValues(data)
            },
        }).then(() => {
            this.log.debug("Data successfully sent to google spreadsheet");
        }).catch(error => {
            this.log.error("Error while sending data to Google Spreadsheet:"+ error);
        });

    }

    private prepareValues(message: any) : any{
        if (Array.isArray(message)){
            return [message];

        } else {
            return [[message]];
        }

    }

}
