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
   * Delete rows from a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param start First row to delete
   * @param end Last row to delete
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  deleteRows(sheetName, start, end, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.get({ spreadsheetId }).then((spreadsheet) => {
        if (spreadsheet && spreadsheet.data.sheets) {
          const sheet = spreadsheet.data.sheets.find(
            (sheet2) => sheet2.properties && sheet2.properties.title == sheetName
          );
          if (sheet && sheet.properties) {
            const sheetId = sheet.properties.sheetId;
            sheets.spreadsheets.batchUpdate({
              spreadsheetId,
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
              resolve();
            }).catch((error) => {
              this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
              reject(
                new Error(
                  `Error while deleting rows from Google Spreadsheet: ${error.message}`
                )
              );
            });
          } else {
            reject(new Error("Sheet not found"));
          }
        } else {
          reject(new Error("No sheets found in spreadsheet"));
        }
      }).catch((error) => {
        this.log.error(`Error while deleting rows from Google Spreadsheet:${error}`);
        reject(new Error(`Error while deleting rows from Google Spreadsheet: ${error.message}`));
      });
    });
  }
  /**
   * Create a new sheet in the Google Sheets
   *
   * @param title The title of the new sheet
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  createSheet(title, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.batchUpdate({
        spreadsheetId,
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
        resolve();
      }).catch((error) => {
        reject(new Error(`Error while creating sheet: ${error.message}`));
      });
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
  duplicateSheet(source, target, index, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.get({ spreadsheetId }).then((spreadsheet) => {
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
              spreadsheetId,
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
              resolve();
            }).catch((error) => {
              this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
              reject(new Error(`Error while duplicating sheet: ${error.message}`));
            });
          } else {
            this.log.warn(`Cannot find sheet: ${source}`);
            reject(new Error(`Cannot find sheet: ${source}`));
          }
        } else {
          reject(new Error("No sheets found in spreadsheet"));
        }
      }).catch((error) => {
        this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
        reject(new Error(`Error while duplicating sheet: ${error.message}`));
      });
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
    return new Promise((resolve, reject) => {
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
        resolve();
      }).catch((error) => {
        this.log.error(`Error while uploading data to Google Spreadsheet:${error}`);
        reject(new Error(`Error while uploading data to Google Spreadsheet: ${error.message}`));
      });
    });
  }
  /**
   * Delete a sheet from the Google Spreadsheet
   *
   * @param title The title of the sheet to delete
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  deleteSheet(title, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.get({ spreadsheetId }).then((spreadsheet) => {
        if (spreadsheet && spreadsheet.data.sheets) {
          const sheet = spreadsheet.data.sheets.find(
            (sheet2) => sheet2.properties && sheet2.properties.title == title
          );
          if (sheet && sheet.properties) {
            sheets.spreadsheets.batchUpdate({
              spreadsheetId,
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
              resolve();
            }).catch((error) => {
              this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
              reject(new Error(`Error while deleting sheet: ${error.message}`));
            });
          } else {
            reject(new Error("Sheet not found"));
          }
        } else {
          reject(new Error("No sheets found in spreadsheet"));
        }
      }).catch((error) => {
        this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
        reject(new Error(`Error while deleting sheet: ${error.message}`));
      });
    });
  }
  /**
   * Delete multiple sheets from the Google Spreadsheet
   *
   * @param titles The titles of the sheets to delete
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  deleteSheets(titles, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.get({ spreadsheetId }).then((spreadsheet) => {
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
              spreadsheetId,
              requestBody: {
                requests
              }
            }).then(() => {
              this.log.debug("Sheets successfully deleted from google spreadsheet");
              resolve();
            }).catch((error) => {
              this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
              reject(new Error(`Error while deleting sheets: ${error.message}`));
            });
          } else {
            reject(new Error("No matching sheets found to delete"));
          }
        } else {
          reject(new Error("No sheets found in spreadsheet"));
        }
      }).catch((error) => {
        this.log.error(`Error while deleting sheets from Google Spreadsheet:${error}`);
        reject(new Error(`Error while deleting sheets: ${error.message}`));
      });
    });
  }
  /**
   * Send data to a Google Spreadsheet
   *
   * @param sheetName Name of the sheet
   * @param data Data to send
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  append(sheetName, data, sheetAlias = null) {
    const sheets = this.init();
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append({
        // The [A1 notation](/sheets/api/guides/concepts#cell) of a range to search for a logical table of data. Values are appended after the last row of the table.
        range: sheetName,
        spreadsheetId: this.getSpreadsheetId(sheetAlias),
        valueInputOption: "USER_ENTERED",
        // Request body metadata
        requestBody: {
          values: this.prepareValues(data)
        }
      }).then(() => {
        this.log.debug("Data successfully sent to google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while sending data to Google Spreadsheet:${error}`);
        reject(new Error(`Error while appending data: ${error.message}`));
      });
    });
  }
  /**
   * Get the spreadsheetId based on the alias or default
   *
   * @param sheetAlias Alias of the sheet to use (optional)
   * @returns The spreadsheetId
   */
  getSpreadsheetId(sheetAlias) {
    if (sheetAlias) {
      const sheet = this.config.spreadsheets.find((s) => s.alias === sheetAlias);
      if (sheet) {
        return sheet.spreadsheetId;
      }
      this.log.warn(`No spreadsheet found for alias ${sheetAlias}, using default spreadsheetId`);
    }
    const defaultSheet = this.config.spreadsheets.find((s) => s.isDefault);
    if (defaultSheet) {
      return defaultSheet.spreadsheetId;
    }
    throw new Error("No default spreadsheetId found in configuration");
  }
  /**
   * Write data to a cell in a Google Spreadsheet
   *
   * @param sheet Name of the sheet
   * @param cell Cell to write to
   * @param value Value to write
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  writeCell(sheet, cell, value, sheetAlias = null) {
    return this.writeCells([{ sheet, cell, value }], sheetAlias);
  }
  /**
   * Write multiple cells in a Google Spreadsheet
   *
   * @param cells Array of objects: { sheet, cell, value }
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  writeCells(cells, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    this.log.info(`Writing cells to spreadsheetId: ${spreadsheetId}`);
    const grouped = {};
    for (const cellObj of cells) {
      if (!grouped[cellObj.sheet]) {
        grouped[cellObj.sheet] = [];
      }
      grouped[cellObj.sheet].push({ cell: cellObj.cell, data: cellObj.value });
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
    this.log.debug(`Prepared data for writing: ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data
        }
      }).then(() => {
        this.log.debug("Cells successfully written to google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while writing cells to Google Spreadsheet:${error}`);
        reject(new Error(`Error while writing cells: ${error.message}`));
      });
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
  async readCell(sheetName, cell, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      if (cell.startsWith("'") && cell.endsWith("'")) {
        cell = cell.substring(1, cell.length - 1);
      }
      sheets.spreadsheets.values.get({
        range: `${sheetName}!${cell}`,
        spreadsheetId
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
  /**
   * Read a range of cells from a Google Spreadsheet.
   *
   * @param sheetName Name of the sheet
   * @param range A1 range, e.g. A1:B10
   * @param sheetAlias Alias of the sheet to use (optional)
   * @returns The values of the requested range as a two-dimensional array
   */
  async readRange(sheetName, range, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    const fullRange = this.buildRange(sheetName, range);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        range: fullRange,
        spreadsheetId
      }).then((response) => {
        var _a;
        this.log.debug("Range successfully retrieved from google spreadsheet");
        resolve((_a = response.data.values) != null ? _a : []);
      }).catch((error) => {
        this.log.error(`Error while retrieving range from Google Spreadsheet:${error}`);
        reject(new Error(`Error while retrieving range from Google Spreadsheet: ${error.message}`));
      });
    });
  }
  /**
   * Write a rectangular range to a Google Spreadsheet.
   *
   * @param sheetName Name of the sheet
   * @param range A1 range, e.g. A1:B10
   * @param values Values to write, either a 2D array or a simple array
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  async writeRange(sheetName, range, values, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    const normalizedValues = this.normalizeRangeValues(values);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.update({
        range: this.buildRange(sheetName, range),
        spreadsheetId,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: normalizedValues
        }
      }).then(() => {
        this.log.debug("Range successfully written to google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while writing range to Google Spreadsheet:${error}`);
        reject(new Error(`Error while writing range: ${error.message}`));
      });
    });
  }
  /**
   * Clear a range of cells in a Google Spreadsheet.
   *
   * @param sheetName Name of the sheet
   * @param range A1 range, e.g. A1:B10
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  clearRange(sheetName, range, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: this.buildRange(sheetName, range),
        requestBody: {}
      }).then(() => {
        this.log.debug("Range successfully cleared from google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while clearing range from Google Spreadsheet:${error}`);
        reject(new Error(`Error while clearing range: ${error.message}`));
      });
    });
  }
  /**
   * Set the formatting for a range of cells.
   *
   * @param sheetName Name of the sheet
   * @param range A1 range, e.g. A1:B10
   * @param format Format settings such as backgroundColor and textFormat
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  async setCellFormat(sheetName, range, format, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    const gridRange = await this.getGridRangeForSheet(sheetName, spreadsheetId, range);
    const userEnteredFormat = {};
    const supportedFields = [];
    if (format.backgroundColor) {
      userEnteredFormat.backgroundColor = this.normalizeColor(format.backgroundColor);
      supportedFields.push("backgroundColor");
    }
    if (format.textFormat) {
      userEnteredFormat.textFormat = format.textFormat;
      supportedFields.push("textFormat");
    }
    if (format.horizontalAlignment) {
      userEnteredFormat.horizontalAlignment = format.horizontalAlignment;
      supportedFields.push("horizontalAlignment");
    }
    if (format.verticalAlignment) {
      userEnteredFormat.verticalAlignment = format.verticalAlignment;
      supportedFields.push("verticalAlignment");
    }
    if (format.numberFormat) {
      userEnteredFormat.numberFormat = format.numberFormat;
      supportedFields.push("numberFormat");
    }
    if (supportedFields.length === 0) {
      throw new Error("No valid format properties provided");
    }
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: gridRange,
                cell: {
                  userEnteredFormat
                },
                fields: `userEnteredFormat(${supportedFields.join(",")})`
              }
            }
          ]
        }
      }).then(() => {
        this.log.debug("Cell format successfully updated in google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while setting cell format in Google Spreadsheet:${error}`);
        reject(new Error(`Error while setting cell format: ${error.message}`));
      });
    });
  }
  /**
   * Create a chart in a Google Spreadsheet.
   *
   * @param sheetName Name of the sheet
   * @param chartConfig Chart configuration such as title, range, chartType and position
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  async createChart(sheetName, chartConfig, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    const sheetId = await this.getSheetIdByName(sheetName, spreadsheetId);
    const request = this.buildChartRequest(sheetId, chartConfig, "addChart");
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [request]
        }
      }).then(() => {
        this.log.debug("Chart successfully created in google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while creating chart in Google Spreadsheet:${error}`);
        reject(new Error(`Error while creating chart: ${error.message}`));
      });
    });
  }
  /**
   * Update an existing chart in a Google Spreadsheet.
   *
   * @param sheetName Name of the sheet 
   * @param chartId ID of the chart to update
   * @param chartConfig Chart configuration such as title, range, chartType and position
   * @param sheetAlias Alias of the sheet to use (optional)
   */
  async updateChart(sheetName, chartId, chartConfig, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    const sheetId = await this.getSheetIdByName(sheetName, spreadsheetId);
    const request = this.buildChartRequest(sheetId, chartConfig, "updateChartSpec", chartId);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [request]
        }
      }).then(() => {
        this.log.debug("Chart successfully updated in google spreadsheet");
        resolve();
      }).catch((error) => {
        this.log.error(`Error while updating chart in Google Spreadsheet:${error}`);
        reject(new Error(`Error while updating chart: ${error.message}`));
      });
    });
  }
  /**
   * Get the number of the last non-empty row in a Google Spreadsheet sheet.
   *
   * @param sheetName Name of the sheet
   * @param sheetAlias Alias of the sheet to use (optional)
   * @returns The number of the last non-empty row, or 0 for an empty sheet
   */
  async getLastRow(sheetName, sheetAlias = null) {
    const sheets = this.init();
    const spreadsheetId = this.getSpreadsheetId(sheetAlias);
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        range: sheetName,
        spreadsheetId
      }).then((response) => {
        var _a, _b;
        this.log.debug("Last row successfully retrieved from google spreadsheet");
        resolve((_b = (_a = response.data.values) == null ? void 0 : _a.length) != null ? _b : 0);
      }).catch((error) => {
        this.log.error(`Error while retrieving the last row from Google Spreadsheet:${error}`);
        reject(new Error(`Error while retrieving the last row from Google Spreadsheet: ${error.message}`));
      });
    });
  }
  prepareValues(message) {
    if (Array.isArray(message)) {
      return [message];
    }
    return [[message]];
  }
  buildRange(sheetName, range) {
    return range.includes("!") ? range : `${sheetName}!${range}`;
  }
  normalizeRangeValues(values) {
    if (Array.isArray(values) && values.length > 0 && Array.isArray(values[0])) {
      return values;
    }
    if (Array.isArray(values)) {
      return [values];
    }
    return [[values]];
  }
  normalizeColor(color) {
    var _a, _b, _c, _d;
    if (typeof color === "string" && color.startsWith("#")) {
      const hex = color.replace("#", "");
      const normalized = hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex;
      const r = Number.parseInt(normalized.substring(0, 2), 16) / 255;
      const g = Number.parseInt(normalized.substring(2, 4), 16) / 255;
      const b = Number.parseInt(normalized.substring(4, 6), 16) / 255;
      return { red: r, green: g, blue: b, alpha: 1 };
    }
    if (typeof color === "object" && color !== null) {
      return {
        red: Number((_a = color.red) != null ? _a : 0),
        green: Number((_b = color.green) != null ? _b : 0),
        blue: Number((_c = color.blue) != null ? _c : 0),
        alpha: Number((_d = color.alpha) != null ? _d : 1)
      };
    }
    return { red: 0, green: 0, blue: 0, alpha: 1 };
  }
  parseA1Range(range) {
    const normalized = range.trim().replace(/^'([^']+)'!/, "");
    const match = normalized.match(/^([A-Z]+)([0-9]+)(?::([A-Z]+)([0-9]+))?$/i);
    if (!match) {
      throw new Error(`Invalid cell range: ${range}`);
    }
    const startCol = this.columnToIndex(match[1]);
    const startRow = Number(match[2]);
    const endCol = match[3] ? this.columnToIndex(match[3]) : startCol;
    const endRow = match[4] ? Number(match[4]) : startRow;
    return {
      startRowIndex: Math.max(0, startRow - 1),
      endRowIndex: Math.max(startRow, endRow),
      startColumnIndex: startCol,
      endColumnIndex: endCol + 1
    };
  }
  columnToIndex(column) {
    let value = 0;
    for (const char of column.toUpperCase()) {
      value = value * 26 + (char.charCodeAt(0) - 64);
    }
    return value - 1;
  }
  async getSheetIdByName(sheetName, spreadsheetId) {
    var _a;
    const sheets = this.init();
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = (_a = spreadsheet.data.sheets) == null ? void 0 : _a.find(
      (item) => item.properties && item.properties.title === sheetName
    );
    if (!sheet || !sheet.properties || sheet.properties.sheetId === void 0 || sheet.properties.sheetId === null) {
      throw new Error(`Sheet not found: ${sheetName}`);
    }
    return Number(sheet.properties.sheetId);
  }
  async getGridRangeForSheet(sheetName, spreadsheetId, range) {
    const sheetId = await this.getSheetIdByName(sheetName, spreadsheetId);
    const parsed = this.parseA1Range(range);
    return {
      sheetId,
      startRowIndex: parsed.startRowIndex,
      endRowIndex: parsed.endRowIndex,
      startColumnIndex: parsed.startColumnIndex,
      endColumnIndex: parsed.endColumnIndex
    };
  }
  buildChartRequest(sheetId, chartConfig, operation, chartId) {
    var _a, _b, _c, _d;
    const chartType = this.normalizeChartType(chartConfig.chartType || "line");
    const range = this.parseA1Range(chartConfig.range || "A1:B2");
    const spec = {
      title: chartConfig.title || "Chart",
      basicChart: {
        chartType,
        legendPosition: chartConfig.legendPosition || "BOTTOM_LEGEND",
        headerCount: 1,
        axis: [
          { position: "BOTTOM_AXIS", title: chartConfig.xAxis || "X" },
          { position: "LEFT_AXIS", title: chartConfig.yAxis || "Y" }
        ],
        domains: [
          {
            domain: {
              sourceRange: {
                sources: [
                  {
                    sheetId,
                    startRowIndex: range.startRowIndex,
                    endRowIndex: range.endRowIndex,
                    startColumnIndex: range.startColumnIndex,
                    endColumnIndex: range.startColumnIndex + 1
                  }
                ]
              }
            }
          }
        ],
        series: [
          {
            series: {
              sourceRange: {
                sources: [
                  {
                    sheetId,
                    startRowIndex: range.startRowIndex,
                    endRowIndex: range.endRowIndex,
                    startColumnIndex: range.startColumnIndex + 1,
                    endColumnIndex: range.endColumnIndex
                  }
                ]
              }
            },
            targetAxis: "LEFT_AXIS"
          }
        ]
      }
    };
    const position = chartConfig.position || { row: 0, column: 0, width: 640, height: 360 };
    const request = {
      chart: {
        spec,
        position: {
          overlayPosition: {
            anchorCell: {
              sheetId,
              rowIndex: Number((_a = position.row) != null ? _a : 0),
              columnIndex: Number((_b = position.column) != null ? _b : 0)
            },
            offsetXPixels: 0,
            offsetYPixels: 0
          },
          size: {
            widthPixels: Number((_c = position.width) != null ? _c : 640),
            heightPixels: Number((_d = position.height) != null ? _d : 360)
          }
        }
      }
    };
    if (operation === "addChart") {
      return { addChart: request };
    }
    return {
      updateChartSpec: {
        chartId: Number(chartId != null ? chartId : 0),
        spec
      }
    };
  }
  normalizeChartType(chartType) {
    const normalized = chartType.toUpperCase();
    const map = {
      LINE: "LINE",
      BAR: "BAR",
      COLUMN: "COLUMN",
      PIE: "PIE",
      AREA: "AREA",
      SCATTER: "SCATTER"
    };
    return map[normalized] || "LINE";
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
