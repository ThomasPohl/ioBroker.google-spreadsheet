"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var google_exports = {};
__export(google_exports, {
  SpreadsheetUtils: () => SpreadsheetUtils
});
module.exports = __toCommonJS(google_exports);
var import_googleapis = require("googleapis");
class SpreadsheetUtils {
  /**
   * Constructor
   *
   * @param config The adapter configuration
   * @param log The logger
   */
  constructor(config, log) {
    this.config = config;
    this.log = log;
  }
  /**
   * Delete rows from a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param start First row to delete
   * @param end Last row to delete
   */
  deleteRows(sheetName, start, end) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find(
          (sheet2) => sheet2.properties && sheet2.properties.title == sheetName
        );
        if (sheet && sheet.properties) {
          const sheetId = sheet.properties.sheetId;
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests: [
                {
                  deleteDimension: {
                    range: {
                      dimension: "ROWS",
                      endIndex: end,
                      sheetId,
                      startIndex: start - 1
                    }
                  }
                }
              ]
            }
          }).then(() => {
            this.log.debug("Rows successfully deleted from google spreadsheet");
          }).catch((error) => {
            this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
          });
        }
      }
    }).catch((error) => {
      this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
    });
  }
  init() {
    const auth = new import_googleapis.google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.serviceAccountEmail,
        private_key: this.formatPrivateKey(this.config.privateKey)
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return import_googleapis.google.sheets({ version: "v4", auth });
  }
  /**
   * Create a new sheet in the Google Spreadsheet
   *
   * @param title The title of the new sheet
   */
  createSheet(title) {
    const sheets = this.init();
    sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.config.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title
              }
            }
          }
        ]
      }
    }).then(() => {
      this.log.debug("Sheet created successfully");
    }).catch((error) => {
      this.log.error(`Error while creating sheet:${error}`);
    });
  }
  /**
   * Duplicate a sheet in the Google Spreadsheet
   *
   * @param source Name of the source sheet
   * @param target Name of the target sheet
   * @param index Position of the new sheet
   */
  duplicateSheet(source, target, index) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find(
          (sheet2) => sheet2.properties && sheet2.properties.title == source
        );
        if (sheet && sheet.properties) {
          let insertIndex = index;
          if (insertIndex == -1 || insertIndex == void 0) {
            insertIndex = spreadsheet.data.sheets.length;
          }
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests: [
                {
                  duplicateSheet: {
                    sourceSheetId: sheet.properties.sheetId,
                    newSheetName: target,
                    insertSheetIndex: insertIndex
                  }
                }
              ]
            }
          }).then(() => {
            this.log.debug("Data successfully sent to google spreadsheet");
          }).catch((error) => {
            this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
          });
        } else {
          this.log.warn(`Cannot find sheet: ${source}`);
        }
      }
    }).catch((error) => {
      this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
    });
  }
  /**
   * Upload a file to the Google Drive
   *
   * @param target Name of the target file
   * @param parentFolder Name of the parent folder
   * @param filecontent Data of the file
   */
  upload(target, parentFolder, filecontent) {
    const auth = new import_googleapis.google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.serviceAccountEmail,
        private_key: this.formatPrivateKey(this.config.privateKey)
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const driveapi = import_googleapis.google.drive({ version: "v3", auth });
    driveapi.files.create({
      requestBody: {
        parents: [parentFolder],
        name: target
      },
      media: {
        mimeType: "application/octet-stream",
        body: filecontent
      },
      fields: "id"
    }).then(() => {
      this.log.debug("Data successfully uploaded to google spreadsheet");
    }).catch((error) => {
      this.log.error(`Error while uploading data to Google Spreadsheet:${error}`);
    });
  }
  /**
   * Delete a sheet from the Google Spreadsheet
   *
   * @param title The title of the sheet to delete
   */
  deleteSheet(title) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find(
          (sheet2) => sheet2.properties && sheet2.properties.title == title
        );
        if (sheet && sheet.properties) {
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests: [
                {
                  deleteSheet: {
                    sheetId: sheet.properties.sheetId
                  }
                }
              ]
            }
          }).then(() => {
            this.log.debug("Data successfully sent to google spreadsheet");
          }).catch((error) => {
            this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
          });
        }
      }
    }).catch((error) => {
      this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
    });
  }
  /**
  * Delete multiple sheets from the Google Spreadsheet
  *
  * @param titles The titles of the sheets to delete
  */
  deleteSheets(titles) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const requests = [];
        for (const title of titles) {
          const sheet = spreadsheet.data.sheets.find(
            (sheet2) => sheet2.properties && sheet2.properties.title == title
          );
          if (sheet && sheet.properties) {
            requests.push({
              deleteSheet: {
                sheetId: sheet.properties.sheetId
              }
            });
          }
        }
        if (requests.length > 0) {
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests
            }
          }).then(() => {
            this.log.debug("Sheets successfully deleted from google spreadsheet");
          }).catch((error) => {
            this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
          });
        }
      }
    }).catch((error) => {
      this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
    });
  }
  /**
   * Send data to a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param data Data to send
   */
  append(sheetName, data) {
    const sheets = this.init();
    sheets.spreadsheets.values.append({
      // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
      range: sheetName,
      spreadsheetId: this.config.spreadsheetId,
      valueInputOption: "USER_ENTERED",
      // Request body metadata
      requestBody: {
        values: this.prepareValues(data)
      }
    }).then(() => {
      this.log.debug("Data successfully sent to google spreadsheet");
    }).catch((error) => {
      this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
    });
  }
  /**
   * Write data to a cell in a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param cell Cell to write to
   * @param data Data to write
   */
  writeCell(sheetName, cell, data) {
    this.writeCells([{ sheetName, cell, data }]);
  }
  /**
   * Write multiple cells in a Google Spreadsheet
   *
   * @param cells Array of objects: { sheetName, cell, data }
   */
  writeCells(cells) {
    const sheets = this.init();
    const grouped = {};
    for (const cellObj of cells) {
      if (!grouped[cellObj.sheetName]) {
        grouped[cellObj.sheetName] = [];
      }
      grouped[cellObj.sheetName].push({ cell: cellObj.cell, data: cellObj.data });
    }
    const data = [];
    for (const sheetName in grouped) {
      for (const entry of grouped[sheetName]) {
        let cell = entry.cell;
        if (cell.startsWith("'") && cell.endsWith("'")) {
          cell = cell.substring(1, cell.length - 1);
        }
        data.push({
          range: `${sheetName}!${cell}`,
          values: this.prepareValues(entry.data)
        });
      }
    }
    sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: this.config.spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data
      }
    }).then(() => {
      this.log.debug("Cells successfully written to google spreadsheet");
    }).catch((error) => {
      this.log.error(`Error while writing cells to Google Spreadsheet:${error}`);
    });
  }
  /**
   * Read data from a cell in a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param cell Cell to read from
   * @returns The data from the cell
   */
  async readCell(sheetName, cell) {
    const sheets = this.init();
    return new Promise((resolve, reject) => {
      if (cell.startsWith("'") && cell.endsWith("'")) {
        cell = cell.substring(1, cell.length - 1);
      }
      sheets.spreadsheets.values.get({
        range: `${sheetName}!${cell}`,
        spreadsheetId: this.config.spreadsheetId
      }).then((response) => {
        this.log.debug("Data successfully retrieved from google spreadsheet");
        if (response.data.values && response.data.values.length > 0) {
          resolve(response.data.values[0][0]);
        } else {
          reject(new Error("No data found"));
        }
      }).catch((error) => {
        this.log.error(`Error while retrieving data from Google Spreadsheet:${error}`);
        reject(new Error(`Error while retrieving data from Google Spreadsheet: ${error.message}`));
      });
    });
  }
  prepareValues(message) {
    if (Array.isArray(message)) {
      return [message];
    }
    return [[message]];
  }
  formatPrivateKey(privateKey) {
    if (privateKey) {
      return privateKey.replace(/\\n/g, "\n");
    }
    return void 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpreadsheetUtils
});
//# sourceMappingURL=google.js.map
