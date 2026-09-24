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
var sheetHandlers_exports = {};
__export(sheetHandlers_exports, {
  handleAppend: () => handleAppend,
  handleCreateChart: () => handleCreateChart,
  handleCreateSheet: () => handleCreateSheet,
  handleDeleteRows: () => handleDeleteRows,
  handleDeleteSheet: () => handleDeleteSheet,
  handleDeleteSheets: () => handleDeleteSheets,
  handleDuplicateSheet: () => handleDuplicateSheet,
  handleGetLastRow: () => handleGetLastRow,
  handleUpdateChart: () => handleUpdateChart
});
module.exports = __toCommonJS(sheetHandlers_exports);
var import_validation = require("../validation");
function handleAppend(spreadsheet, log, message) {
  return new Promise((resolve, reject) => {
    const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
    const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
    const values = (0, import_validation.preferValue)(messageData.values, messageData.data);
    const alias = messageData.alias;
    if (!sheet || !values) {
      log.error("Missing parameters for append: 'sheet' and/or 'values'");
      reject(new Error("Missing parameters for append"));
      return;
    }
    spreadsheet.append(sheet, values, alias).then(() => resolve()).catch((error) => reject(new Error(error)));
  });
}
function handleDeleteRows(spreadsheet, log, message) {
  return new Promise((resolve, reject) => {
    const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
    const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
    const start = messageData.start;
    const end = messageData.end;
    const alias = messageData.alias;
    if (!sheet || typeof start !== "number" || typeof end !== "number") {
      log.error("Missing parameters for deleteRows: 'sheet', 'start', 'end'");
      reject(new Error("Missing parameters for deleteRows"));
      return;
    }
    spreadsheet.deleteRows(sheet, start, end, alias).then(() => resolve()).catch((error) => reject(new Error(error)));
  });
}
function handleCreateSheet(spreadsheet, log, message) {
  if (typeof message.message === "string") {
    log.warn("Deprecated call of createSheet with string as message. Please use an object with sheet!");
    return spreadsheet.createSheet(message.message, null);
  }
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const alias = messageData.alias;
  if (!sheet) {
    log.error("Missing parameter for createSheet: 'sheet'");
    return Promise.reject(new Error("Missing parameters for createSheet"));
  }
  return spreadsheet.createSheet(sheet, alias);
}
function handleDeleteSheet(spreadsheet, log, message) {
  if (typeof message.message === "string") {
    log.warn("Deprecated call of deleteSheet with string as message. Please use an object with sheet!");
    return spreadsheet.deleteSheet(message.message);
  }
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const alias = messageData.alias;
  if (!sheet) {
    log.error("Missing parameter for deleteSheet: 'sheet'");
    return Promise.reject(new Error("Missing parameters for deleteSheet"));
  }
  return spreadsheet.deleteSheet(sheet, alias);
}
function handleDeleteSheets(spreadsheet, log, message) {
  if (Array.isArray(message.message)) {
    log.warn("Deprecated call of deleteSheets with array as message. Please use an object with sheets!");
    return spreadsheet.deleteSheets(message.message, null);
  }
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheets = (0, import_validation.preferValue)(messageData.sheets, messageData.sheetNames);
  const alias = messageData.alias;
  if (!sheets) {
    log.error("Missing parameter for deleteSheets: 'sheets'");
    return Promise.reject(new Error("Missing parameters for deleteSheets"));
  }
  return spreadsheet.deleteSheets(sheets, alias);
}
function handleDuplicateSheet(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const source = messageData.source;
  const target = messageData.target;
  const index = messageData.index;
  const alias = messageData.alias;
  if (!source || !target || typeof index !== "number") {
    log.error("Missing parameters for duplicateSheet: 'source', 'target', 'index'");
    return Promise.reject(new Error("Missing parameters for duplicateSheet"));
  }
  return spreadsheet.duplicateSheet(source, target, index, alias);
}
function handleGetLastRow(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const alias = messageData.alias;
  if (!sheet) {
    log.error("Missing parameter for getLastRow: 'sheet'");
    return Promise.reject(new Error("Missing parameters for getLastRow"));
  }
  return spreadsheet.getLastRow(sheet, alias);
}
function handleCreateChart(spreadsheet, log, message) {
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const chart = messageData.chart || messageData;
  const alias = messageData.alias;
  if (!sheet || !chart.range) {
    log.error("Missing parameters for createChart: 'sheet', 'chart.range'");
    return Promise.reject(new Error("Missing parameters for createChart"));
  }
  return spreadsheet.createChart(sheet, chart, alias);
}
function handleUpdateChart(spreadsheet, log, message) {
  var _a;
  const messageData = (0, import_validation.normalizeLegacyMessage)(message.message);
  const sheet = (0, import_validation.preferValue)(messageData.sheet, messageData.sheetName);
  const chart = messageData.chart || messageData;
  const alias = messageData.alias;
  const chartId = (_a = messageData.chartId) != null ? _a : messageData.id;
  if (!sheet || !chart.range || chartId === void 0) {
    log.error("Missing parameters for updateChart: 'sheet', 'chart.range', 'chartId'");
    return Promise.reject(new Error("Missing parameters for updateChart"));
  }
  return spreadsheet.updateChart(sheet, Number(chartId), chart, alias);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleAppend,
  handleCreateChart,
  handleCreateSheet,
  handleDeleteRows,
  handleDeleteSheet,
  handleDeleteSheets,
  handleDuplicateSheet,
  handleGetLastRow,
  handleUpdateChart
});
//# sourceMappingURL=sheetHandlers.js.map
