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
  handleCreateSheet: () => handleCreateSheet,
  handleDeleteRows: () => handleDeleteRows,
  handleDeleteSheet: () => handleDeleteSheet,
  handleDeleteSheets: () => handleDeleteSheets,
  handleDuplicateSheet: () => handleDuplicateSheet
});
module.exports = __toCommonJS(sheetHandlers_exports);
function handleAppend(spreadsheet, log, message) {
  return new Promise((resolve, reject) => {
    const messageData = message.message;
    let sheet = messageData.sheet;
    let values = messageData.values;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
      log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
      sheet = messageData.sheetName;
    }
    if (!values && messageData.data) {
      log.warn("Parameter 'data' is deprecated, please use 'values' instead!");
      values = messageData.data;
    }
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
    const messageData = message.message;
    let sheet = messageData.sheet;
    const start = messageData.start;
    const end = messageData.end;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
      log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
      sheet = messageData.sheetName;
    }
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
  const messageData = message.message;
  let sheet = messageData.sheet;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
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
  const messageData = message.message;
  let sheet = messageData.sheet;
  const alias = messageData.alias;
  if (!sheet && messageData.sheetName) {
    log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
    sheet = messageData.sheetName;
  }
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
  const messageData = message.message;
  let sheets = messageData.sheets;
  const alias = messageData.alias;
  if (!sheets && messageData.sheetNames) {
    log.warn("Parameter 'sheetNames' is deprecated, please use 'sheets' instead!");
    sheets = messageData.sheetNames;
  }
  if (!sheets) {
    log.error("Missing parameter for deleteSheets: 'sheets'");
    return Promise.reject(new Error("Missing parameters for deleteSheets"));
  }
  return spreadsheet.deleteSheets(sheets, alias);
}
function handleDuplicateSheet(spreadsheet, log, message) {
  const messageData = message.message;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleAppend,
  handleCreateSheet,
  handleDeleteRows,
  handleDeleteSheet,
  handleDeleteSheets,
  handleDuplicateSheet
});
//# sourceMappingURL=sheetHandlers.js.map
