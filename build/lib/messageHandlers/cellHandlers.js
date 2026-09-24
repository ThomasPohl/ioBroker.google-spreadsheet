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
var cellHandlers_exports = {};
__export(cellHandlers_exports, {
  handleClearRange: () => handleClearRange,
  handleReadCell: () => handleReadCell,
  handleReadRange: () => handleReadRange,
  handleSetCellFormat: () => handleSetCellFormat,
  handleWriteCell: () => handleWriteCell,
  handleWriteCells: () => handleWriteCells,
  handleWriteRange: () => handleWriteRange
});
module.exports = __toCommonJS(cellHandlers_exports);
function handleWriteCell(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  const cell = messageData.cell;
  let value = messageData.value;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!value && messageData.data) {
    log.warn("Parameter 'data' is deprecated, please use 'value' instead!");
    value = messageData.data;
  }
  if (!sheet || !cell || typeof value === "undefined") {
    log.error("Missing parameters for writeCell: 'sheet', 'cell', 'value'");
    return Promise.reject(new Error("Missing parameters for writeCell"));
  }
  const cellPattern = new RegExp("^[A-Z]+[0-9]+$");
  if (!cellPattern.test(cell)) {
    log.error(`Invalid cell pattern ${cell}. Expected: A1`);
    return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
  }
  return spreadsheet.writeCell(sheet, cell, value, alias);
}
function handleWriteCells(spreadsheet, log, message) {
  const messageData = message.message;
  const cells = messageData.cells;
  const alias = messageData.alias;
  if (!cells) {
    log.error("Missing parameter for writeCells: 'cells'");
    return Promise.reject(new Error("Missing parameters for writeCells"));
  }
  const cellPattern = new RegExp("^[A-Z]+[0-9]+$");
  for (const cellObj of cells) {
    if (!cellObj.sheet && cellObj.sheetName) {
      log.warn("Parameter 'sheetName' in cells is deprecated, please use 'sheet' instead!");
      cellObj.sheet = cellObj.sheetName;
    }
    if (!cellObj.value && typeof cellObj.data !== "undefined") {
      log.warn("Parameter 'data' in cells is deprecated, please use 'value' instead!");
      cellObj.value = cellObj.data;
    }
    if (!cellObj.sheet || !cellObj.cell || typeof cellObj.value === "undefined") {
      log.error("Missing parameters for writeCells: 'sheet', 'cell', 'value' in cells");
      return Promise.reject(new Error("Missing parameters for writeCells"));
    }
    if (!cellPattern.test(cellObj.cell)) {
      log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
      return Promise.reject(new Error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`));
    }
  }
  return spreadsheet.writeCells(cells, alias);
}
function handleReadCell(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  const cell = messageData.cell;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!sheet || !cell) {
    log.error("Missing parameters for readCell: 'sheet', 'cell'");
    return Promise.reject(new Error("Missing parameters for readCell"));
  }
  const cellPattern = new RegExp("^[A-Z]+[0-9]+$");
  if (!cellPattern.test(cell)) {
    log.error(`Invalid cell pattern ${cell}. Expected: A1`);
    return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
  }
  return spreadsheet.readCell(sheet, cell, alias);
}
function handleReadRange(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  let range = messageData.range;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!range && messageData.cellRange) {
    log.warn("Parameter 'cellRange' is deprecated, please use 'range' instead!");
    range = messageData.cellRange;
  }
  if (!sheet || !range) {
    log.error("Missing parameters for readRange: 'sheet', 'range'");
    return Promise.reject(new Error("Missing parameters for readRange"));
  }
  return spreadsheet.readRange(sheet, range, alias);
}
function handleWriteRange(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  let range = messageData.range;
  let values = messageData.values;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!range && messageData.cellRange) {
    log.warn("Parameter 'cellRange' is deprecated, please use 'range' instead!");
    range = messageData.cellRange;
  }
  if (typeof values === "undefined" && typeof messageData.data !== "undefined") {
    log.warn("Parameter 'data' is deprecated, please use 'values' instead!");
    values = messageData.data;
  }
  if (!sheet || !range || typeof values === "undefined") {
    log.error("Missing parameters for writeRange: 'sheet', 'range', 'values'");
    return Promise.reject(new Error("Missing parameters for writeRange"));
  }
  return spreadsheet.writeRange(sheet, range, values, alias);
}
function handleClearRange(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  let range = messageData.range;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!range && messageData.cellRange) {
    log.warn("Parameter 'cellRange' is deprecated, please use 'range' instead!");
    range = messageData.cellRange;
  }
  if (!sheet || !range) {
    log.error("Missing parameters for clearRange: 'sheet', 'range'");
    return Promise.reject(new Error("Missing parameters for clearRange"));
  }
  return spreadsheet.clearRange(sheet, range, alias);
}
function handleSetCellFormat(spreadsheet, log, message) {
  const messageData = message.message;
  let sheet = messageData.sheet;
  let range = messageData.range;
  const format = messageData.format;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
  if (!range && messageData.cellRange) {
    log.warn("Parameter 'cellRange' is deprecated, please use 'range' instead!");
    range = messageData.cellRange;
  }
  if (!sheet || !range || !format) {
    log.error("Missing parameters for setCellFormat: 'sheet', 'range', 'format'");
    return Promise.reject(new Error("Missing parameters for setCellFormat"));
  }
  return spreadsheet.setCellFormat(sheet, range, format, alias);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleClearRange,
  handleReadCell,
  handleReadRange,
  handleSetCellFormat,
  handleWriteCell,
  handleWriteCells,
  handleWriteRange
});
//# sourceMappingURL=cellHandlers.js.map
