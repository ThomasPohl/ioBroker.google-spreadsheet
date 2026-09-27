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
var import_validation = require("../validation");
function handleWriteCell(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const cell = messageData.cell;
  const value = (0, import_validation.preferValue)(messageData.value, messageData.data);
  const alias = messageData.alias;
  if (!sheet || !cell || typeof value === "undefined") {
    log.error("Missing parameters for writeCell: 'sheet', 'cell', 'value'");
    return Promise.reject(new Error("Missing parameters for writeCell"));
  }
  if (!(0, import_validation.isValidCellPattern)(cell)) {
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
  for (const cellObj of cells) {
    const normalized = (0, import_validation.normalizeLegacyMessage)(cellObj);
    const sheet = (0, import_validation.preferValue)(normalized.sheet, normalized.sheetName);
    const value = (0, import_validation.preferValue)(normalized.value, normalized.data);
    if (!sheet || !normalized.cell || typeof value === "undefined") {
      log.error("Missing parameters for writeCells: 'sheet', 'cell', 'value' in cells");
      return Promise.reject(new Error("Missing parameters for writeCells"));
    }
    if (!(0, import_validation.isValidCellPattern)(normalized.cell)) {
      log.error(`Invalid cell pattern ${normalized.cell}. Expected: A1`);
      return Promise.reject(new Error(`Invalid cell pattern ${normalized.cell}. Expected: A1`));
    }
    normalized.sheet = sheet;
    normalized.value = value;
  }
  return spreadsheet.writeCells(cells, alias);
}
function handleReadCell(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const cell = messageData.cell;
  const alias = messageData.alias;
  if (!sheet || !cell) {
    log.error("Missing parameters for readCell: 'sheet', 'cell'");
    return Promise.reject(new Error("Missing parameters for readCell"));
  }
  if (!(0, import_validation.isValidCellPattern)(cell)) {
    log.error(`Invalid cell pattern ${cell}. Expected: A1`);
    return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
  }
  return spreadsheet.readCell(sheet, cell, alias);
}
function handleReadRange(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const range = (0, import_validation.preferValue)(messageData.range, messageData.cellRange);
  const alias = messageData.alias;
  if (!sheet || !range) {
    log.error("Missing parameters for readRange: 'sheet', 'range'");
    return Promise.reject(new Error("Missing parameters for readRange"));
  }
  return spreadsheet.readRange(sheet, range, alias);
}
function handleWriteRange(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const range = (0, import_validation.preferValue)(messageData.range, messageData.cellRange);
  const values = (0, import_validation.preferValue)(messageData.values, messageData.data);
  const alias = messageData.alias;
  if (!sheet || !range || typeof values === "undefined") {
    log.error("Missing parameters for writeRange: 'sheet', 'range', 'values'");
    return Promise.reject(new Error("Missing parameters for writeRange"));
  }
  return spreadsheet.writeRange(sheet, range, values, alias);
}
function handleClearRange(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const range = (0, import_validation.preferValue)(messageData.range, messageData.cellRange);
  const alias = messageData.alias;
  if (!sheet || !range) {
    log.error("Missing parameters for clearRange: 'sheet', 'range'");
    return Promise.reject(new Error("Missing parameters for clearRange"));
  }
  return spreadsheet.clearRange(sheet, range, alias);
}
function handleSetCellFormat(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const range = (0, import_validation.preferValue)(messageData.range, messageData.cellRange);
  const format = messageData.format;
  const alias = messageData.alias;
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
