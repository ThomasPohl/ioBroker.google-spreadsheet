import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';
/**
 * This class provides utility functions to interact with Google Sheets
 *
 * @param config The adapter configuration
 * @param log The logger
 */
export class SpreadsheetUtils {
    /**
     * Constructor
     *
     * @param config The adapter configuration
     * @param log The logger
     */
    public constructor(
        private config: ioBroker.AdapterConfig,
        private log: ioBroker.Log,
    ) {}

    /**
     * Delete rows from a Google Spreadsheet
     *
     * @param sheetName Name of the sheet
     * @param start First row to delete
     * @param end Last row to delete
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public deleteRows(sheetName: string, start: number, end: number, sheetAlias: string | null = null): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);

        sheets.spreadsheets
            .get({ spreadsheetId })
            .then(spreadsheet => {
                if (spreadsheet && spreadsheet.data.sheets) {
                    const sheet = spreadsheet.data.sheets.find(
                        sheet => sheet.properties && sheet.properties.title == sheetName,
                    );
                    if (sheet && sheet.properties) {
                        const sheetId = sheet.properties.sheetId;
                        sheets.spreadsheets
                            .batchUpdate({
                                spreadsheetId,
                                requestBody: {
                                    requests: [
                                        {
                                            deleteDimension: {
                                                range: {
                                                    dimension: 'ROWS',
                                                    endIndex: end,
                                                    sheetId: sheetId,
                                                    startIndex: start - 1,
                                                },
                                            },
                                        },
                                    ],
                                },
                            })
                            .then(() => {
                                this.log.debug('Rows successfully deleted from google spreadsheet');
                            })
                            .catch(error => {
                                this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
                            });
                    }
                }
            })
            .catch(error => {
                this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
            });
    }

    private init(): sheets_v4.Sheets {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: this.config.serviceAccountEmail,
                private_key: this.formatPrivateKey(this.config.privateKey),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        return google.sheets({ version: 'v4', auth });
    }

    /**
     * Create a new sheet in the Google Sheets
     *
     * @param title The title of the new sheet
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public createSheet(title: string, sheetAlias: string | null = null): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);

        sheets.spreadsheets
            .batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: title,
                                },
                            },
                        },
                    ],
                },
            })
            .then(() => {
                this.log.debug('Sheet created successfully');
            })
            .catch(error => {
                this.log.error(`Error while creating sheet:${error}`);
            });
    }

    /**
     * Duplicate a sheet in the Google Spreadsheet
     *
     * @param source Name of the source sheet
     * @param target Name of the target sheet
     * @param index Position of the new sheet
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public duplicateSheet(source: string, target: string, index: number, sheetAlias: string | null = null): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);

        sheets.spreadsheets
            .get({ spreadsheetId })
            .then(spreadsheet => {
                if (spreadsheet && spreadsheet.data.sheets) {
                    const sheet = spreadsheet.data.sheets.find(
                        sheet => sheet.properties && sheet.properties.title == source,
                    );
                    if (sheet && sheet.properties) {
                        let insertIndex = index;
                        if (insertIndex == -1 || insertIndex == undefined) {
                            insertIndex = spreadsheet.data.sheets.length;
                        }
                        sheets.spreadsheets
                            .batchUpdate({
                                spreadsheetId,
                                requestBody: {
                                    requests: [
                                        {
                                            duplicateSheet: {
                                                sourceSheetId: sheet.properties.sheetId,
                                                newSheetName: target,
                                                insertSheetIndex: insertIndex,
                                            },
                                        },
                                    ],
                                },
                            })
                            .then(() => {
                                this.log.debug('Data successfully sent to google spreadsheet');
                            })
                            .catch(error => {
                                this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
                            });
                    } else {
                        this.log.warn(`Cannot find sheet: ${source}`);
                    }
                }
            })
            .catch(error => {
                this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
            });
    }

    /**
     * Upload a file to the Google Drive
     *
     * @param target Name of the target file
     * @param parentFolder Name of the parent folder
     * @param filecontent Data of the file
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public upload(target: string, parentFolder: string, filecontent: any): void {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: this.config.serviceAccountEmail,
                private_key: this.formatPrivateKey(this.config.privateKey),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const driveapi = google.drive({ version: 'v3', auth });
        // Hinweis: sheetAlias wird hier nicht für die Drive API verwendet, da Drive keine spreadsheetId benötigt,
        // aber falls du für verschiedene Konten/Freigaben arbeitest, ggf. anpassen.
        driveapi.files
            .create({
                requestBody: {
                    parents: [parentFolder],
                    name: target,
                },
                media: {
                    mimeType: 'application/octet-stream',
                    body: filecontent,
                },
                fields: 'id',
            })
            .then(() => {
                this.log.debug('Data successfully uploaded to google spreadsheet');
            })
            .catch(error => {
                this.log.error(`Error while uploading data to Google Spreadsheet:${error}`);
            });
    }

    /**
     * Delete a sheet from the Google Spreadsheet
     *
     * @param title The title of the sheet to delete
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public deleteSheet(title: string, sheetAlias: string | null = null): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);

        sheets.spreadsheets
            .get({ spreadsheetId })
            .then(spreadsheet => {
                if (spreadsheet && spreadsheet.data.sheets) {
                    const sheet = spreadsheet.data.sheets.find(
                        sheet => sheet.properties && sheet.properties.title == title,
                    );
                    if (sheet && sheet.properties) {
                        sheets.spreadsheets
                            .batchUpdate({
                                spreadsheetId,
                                requestBody: {
                                    requests: [
                                        {
                                            deleteSheet: {
                                                sheetId: sheet.properties.sheetId,
                                            },
                                        },
                                    ],
                                },
                            })
                            .then(() => {
                                this.log.debug('Data successfully sent to google spreadsheet');
                            })
                            .catch(error => {
                                this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
                            });
                    }
                }
            })
            .catch(error => {
                this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
            });
    }

    /**
     * Delete multiple sheets from the Google Spreadsheet
     *
     * @param titles The titles of the sheets to delete
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public deleteSheets(titles: string[], sheetAlias: string | null = null): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);

        sheets.spreadsheets
            .get({ spreadsheetId })
            .then(spreadsheet => {
                if (spreadsheet && spreadsheet.data.sheets) {
                    const requests: sheets_v4.Schema$Request[] = [];
                    for (const title of titles) {
                        const sheet = spreadsheet.data.sheets.find(
                            sheet => sheet.properties && sheet.properties.title == title,
                        );
                        if (sheet && sheet.properties) {
                            requests.push({
                                deleteSheet: {
                                    sheetId: sheet.properties.sheetId,
                                },
                            });
                        }
                    }
                    if (requests.length > 0) {
                        sheets.spreadsheets
                            .batchUpdate({
                                spreadsheetId,
                                requestBody: {
                                    requests: requests,
                                },
                            })
                            .then(() => {
                                this.log.debug('Sheets successfully deleted from google spreadsheet');
                            })
                            .catch(error => {
                                this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
                            });
                    }
                }
            })
            .catch(error => {
                this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
            });
    }

    /**
     * Send data to a Google Spreadsheet
     *
     * @param sheetName Name of the sheet
     * @param data Data to send
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public append(sheetName: string, data: any, sheetAlias: string | null = null): void {
        const sheets = this.init();

        sheets.spreadsheets.values
            .append({
                // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
                range: sheetName,
                spreadsheetId: this.getSpreadsheetId(sheetAlias),
                valueInputOption: 'USER_ENTERED',
                // Request body metadata
                requestBody: {
                    values: this.prepareValues(data),
                },
            })
            .then(() => {
                this.log.debug('Data successfully sent to google spreadsheet');
            })
            .catch(error => {
                this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
            });
    }

    /**
     * Get the spreadsheetId based on the alias or default
     *
     * @param sheetAlias Alias of the sheet to use (optional)
     * @returns The spreadsheetId
     */
    getSpreadsheetId(sheetAlias: string | null): string {
        if (sheetAlias) {
            const sheet = this.config.spreadsheets.find(s => s.alias === sheetAlias);
            if (sheet) {
                return sheet.spreadsheetId;
            }
            this.log.warn(`No spreadsheet found for alias ${sheetAlias}, using default spreadsheetId`);
        }
        const defaultSheet = this.config.spreadsheets.find(s => s.isDefault);
        if (defaultSheet) {
            return defaultSheet.spreadsheetId;
        }
        throw new Error('No default spreadsheetId found in configuration');
    }

    /**
     * Write data to a cell in a Google Spreadsheet
     *
     * @param sheetName Name of the sheet
     * @param cell Cell to write to
     * @param data Data to write
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public writeCell(sheetName: string, cell: string, data: any, sheetAlias: string | null = null): void {
        this.writeCells([{ sheetName, cell, data }], sheetAlias);
    }

    /**
     * Write multiple cells in a Google Spreadsheet
     *
     * @param cells Array of objects: { sheetName, cell, data }
     * @param sheetAlias Alias of the sheet to use (optional)
     */
    public writeCells(
        cells: Array<{ sheetName: string; cell: string; data: any }>,
        sheetAlias: string | null = null,
    ): void {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);
        // Gruppiere nach sheetName, da batchUpdate mehrere Bereiche pro Sheet erlaubt
        const grouped: { [sheet: string]: Array<{ cell: string; data: any }> } = {};
        for (const cellObj of cells) {
            if (!grouped[cellObj.sheetName]) {
                grouped[cellObj.sheetName] = [];
            }
            grouped[cellObj.sheetName].push({ cell: cellObj.cell, data: cellObj.data });
        }
        const data: Array<{ range: string; values: any[][] }> = [];
        for (const sheetName in grouped) {
            for (const entry of grouped[sheetName]) {
                let cell = entry.cell;
                if (cell.startsWith("'") && cell.endsWith("'")) {
                    cell = cell.substring(1, cell.length - 1);
                }
                data.push({
                    range: `${sheetName}!${cell}`,
                    values: this.prepareValues(entry.data),
                });
            }
        }
        sheets.spreadsheets.values
            .batchUpdate({
                spreadsheetId,
                requestBody: {
                    valueInputOption: 'USER_ENTERED',
                    data,
                },
            })
            .then(() => {
                this.log.debug('Cells successfully written to google spreadsheet');
            })
            .catch(error => {
                this.log.error(`Error while writing cells to Google Spreadsheet:${error}`);
            });
    }

    /**
     * Read data from a cell in a Google Spreadsheet
     *
     * @param sheetName Name of the sheet
     * @param cell Cell to read from
     * @param sheetAlias Alias of the sheet to use (optional)
     * @returns The data from the cell
     */
    public async readCell(sheetName: string, cell: string, sheetAlias: string | null = null): Promise<any> {
        const sheets = this.init();
        const spreadsheetId = this.getSpreadsheetId(sheetAlias);
        return new Promise<any>((resolve, reject) => {
            if (cell.startsWith("'") && cell.endsWith("'")) {
                cell = cell.substring(1, cell.length - 1);
            }
            sheets.spreadsheets.values
                .get({
                    range: `${sheetName}!${cell}`,
                    spreadsheetId,
                })
                .then(response => {
                    this.log.debug('Data successfully retrieved from google spreadsheet');
                    if (response.data.values && response.data.values.length > 0) {
                        resolve(response.data.values[0][0]);
                    } else {
                        reject(new Error('No data found'));
                    }
                })
                .catch(error => {
                    this.log.error(`Error while retrieving data from Google Spreadsheet:${error}`);
                    reject(new Error(`Error while retrieving data from Google Spreadsheet: ${error.message}`));
                });
        });
    }
    private prepareValues(message: any): any {
        if (Array.isArray(message)) {
            return [message];
        }
        return [[message]];
    }
    private formatPrivateKey(privateKey: string): string | undefined {
        //replace all \n with line breaks
        if (privateKey) {
            return privateKey.replace(/\\n/g, '\n');
        }
        return undefined;
    }
}
