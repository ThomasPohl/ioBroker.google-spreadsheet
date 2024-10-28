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
var import_google_auth_library = require("google-auth-library");
class SpreadsheetUtils {
  constructor(config, log) {
    this.config = config;
    this.log = log;
  }
  deleteRows(sheetName, start, end) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == sheetName);
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
                      sheetId,
                      startIndex: start - 1
                    }
                  }
                }]
              }
            }
          ).then(() => {
            this.log.debug("Rows successfully deleted from google spreadsheet");
          }).catch((error) => {
            this.log.error("Error while deleting rows from Google Spreadsheet:" + error);
          });
        }
      }
    });
  }
  init() {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.formatPrivateKey(this.config.privateKey),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return import_googleapis.google.sheets({ version: "v4", auth });
  }
  createSheet(title) {
    const sheets = this.init();
    sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.config.spreadsheetId,
      requestBody: {
        requests: [{ addSheet: {
          properties: {
            title
          }
        } }]
      }
    }).then(() => {
      this.log.debug("Sheet created successfully");
    }).catch((error) => {
      this.log.error("Error while creating sheet:" + error);
    });
  }
  duplicateSheet(source, target, index) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == source);
        if (sheet && sheet.properties) {
          let insertIndex = index;
          if (insertIndex == -1 || insertIndex == void 0) {
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
          }).catch((error) => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
          });
        } else {
          this.log.warn("Cannot find sheet: " + source);
        }
      }
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  upload(source, target, parentFolder, filecontent) {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.config.privateKey,
      scopes: ["https://www.googleapis.com/auth/drive.file"]
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
      this.log.error("Error while uploading data to Google Spreadsheet:" + error);
    });
  }
  deleteSheet(title) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == title);
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
          }).catch((error) => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
          });
        }
      }
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
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
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  writeCell(sheetName, cell, data) {
    const sheets = this.init();
    if (cell.startsWith("'") && cell.endsWith("'")) {
      cell = cell.substring(1, cell.length - 1);
    }
    sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: this.config.spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [{
          range: sheetName + "!" + cell,
          values: this.prepareValues(data)
        }]
      }
    }).then(() => {
      this.log.debug("Data successfully sent to google spreadsheet");
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  async readCell(sheetName, cell) {
    const sheets = this.init();
    return new Promise((resolve, reject) => {
      if (cell.startsWith("'") && cell.endsWith("'")) {
        cell = cell.substring(1, cell.length - 1);
      }
      sheets.spreadsheets.values.get({
        range: sheetName + "!" + cell,
        spreadsheetId: this.config.spreadsheetId
      }).then((response) => {
        this.log.debug("Data successfully retrieved from google spreadsheet");
        if (response.data.values && response.data.values.length > 0) {
          resolve(response.data.values[0][0]);
        } else {
          reject("No data found");
        }
      }).catch((error) => {
        this.log.error("Error while retrieving data from Google Spreadsheet:" + error);
        reject(error);
      });
    });
  }
  prepareValues(message) {
    if (Array.isArray(message)) {
      return [message];
    } else {
      return [[message]];
    }
  }
  formatPrivateKey(privateKey) {
    if (privateKey) {
      return privateKey.replace(/\\n/g, "\n");
    } else {
      return void 0;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpreadsheetUtils
});
//# sourceMappingURL=google.js.map
