"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var messageHandlers_exports = {};
__export(messageHandlers_exports, {
  handleAppend: () => handleAppend,
  handleCreateSheet: () => handleCreateSheet,
  handleDeleteRows: () => handleDeleteRows,
  handleDeleteSheet: () => handleDeleteSheet,
  handleDeleteSheets: () => handleDeleteSheets,
  handleDuplicateSheet: () => handleDuplicateSheet,
  handleReadCell: () => handleReadCell,
  handleUpload: () => handleUpload,
  handleWriteCell: () => handleWriteCell,
  handleWriteCells: () => handleWriteCells
});
module.exports = __toCommonJS(messageHandlers_exports);
var import_fs = __toESM(require("fs"));
function handleAppend(spreadsheet, log, message) {
  return new Promise((resolve, reject) => {
    const messageData = message.message;
    if (missingParameters(["sheetName", "data"], messageData, log)) {
      reject(new Error("Missing parameters for append"));
    }
    spreadsheet.append(messageData.sheetName, messageData.data, messageData.alias).then(() => resolve()).catch((error) => reject(new Error(error)));
  });
}
function handleDeleteRows(spreadsheet, log, message) {
  return new Promise((resolve, reject) => {
    const messageData = message.message;
    if (missingParameters(["sheetName", "start", "end"], messageData, log)) {
      reject(new Error("Missing parameters for deleteRows"));
    }
    spreadsheet.deleteRows(messageData.sheetName, messageData.start, messageData.end, messageData.alias).then(() => resolve()).catch((error) => reject(new Error(error)));
  });
}
function handleCreateSheet(spreadsheet, log, message) {
  if (typeof message.message === "string") {
    log.warn(
      "Deprecated call of createSheet with string as message. Please use object with sheetName and optional alias!"
    );
    return spreadsheet.createSheet(message.message, null);
  }
  const messageData = message.message;
  if (missingParameters(["sheetName"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for createSheet"));
  }
  return spreadsheet.createSheet(messageData.sheetName, messageData.alias);
}
function handleDeleteSheet(spreadsheet, log, message) {
  if (typeof message.message === "string") {
    log.warn(
      "Deprecated call of deleteSheet with non-string as message. Please use object with sheetName and optional alias!"
    );
    return spreadsheet.deleteSheet(message.message);
  }
  const messageData = message.message;
  if (missingParameters(["sheetName"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for deleteSheet"));
  }
  return spreadsheet.deleteSheet(messageData.sheetName, messageData.alias);
}
function handleDeleteSheets(spreadsheet, log, message) {
  if (Array.isArray(message.message)) {
    log.warn(
      "Deprecated call of deleteSheets with array as message. Please use object with sheetNames and optional alias!"
    );
    return spreadsheet.deleteSheets(message.message, null);
  }
  const messageData = message.message;
  if (missingParameters(["sheetNames"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for deleteSheets"));
  }
  return spreadsheet.deleteSheets(messageData.sheetNames, messageData.alias);
}
function handleDuplicateSheet(spreadsheet, log, message) {
  const messageData = message.message;
  if (missingParameters(["source", "target", "index"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for duplicateSheet"));
  }
  return spreadsheet.duplicateSheet(messageData.source, messageData.target, messageData.index, messageData.alias);
}
function handleUpload(spreadsheet, log, message) {
  const messageData = message.message;
  if (missingParameters(["target", "parentFolder"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for upload"));
  }
  return spreadsheet.upload(messageData.target, messageData.parentFolder, import_fs.default.createReadStream(messageData.source));
}
function handleWriteCell(spreadsheet, log, message) {
  const messageData = message.message;
  if (missingParameters(["sheetName", "cell", "data"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for writeCell"));
  }
  const cellPattern = new RegExp("[A-Z]+[0-9]+()");
  if (!cellPattern.test(messageData.cell)) {
    log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
    return Promise.reject(new Error(`Invalid cell pattern ${messageData.cell}. Expected: A1`));
  }
  return spreadsheet.writeCell(messageData.sheetName, messageData.cell, messageData.data, messageData.alias);
}
function handleWriteCells(spreadsheet, log, message) {
  const messageData = message.message;
  if (missingParameters(["cells"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for writeCells"));
  }
  const cells = messageData.cells;
  const cellPattern = new RegExp("[A-Z]+[0-9]+()");
  for (const cellObj of cells) {
    if (!cellPattern.test(cellObj.cell)) {
      log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
      return Promise.reject(new Error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`));
    }
  }
  return spreadsheet.writeCells(cells, messageData.alias);
}
function handleReadCell(spreadsheet, log, message) {
  const messageData = message.message;
  if (missingParameters(["sheetName", "cell"], messageData, log)) {
    return Promise.reject(new Error("Missing parameters for readCell"));
  }
  const cellPattern = new RegExp("[A-Z]+[0-9]+()");
  if (!cellPattern.test(messageData.cell)) {
    log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
    return Promise.reject(new Error(`Invalid cell pattern ${messageData.cell}. Expected: A1`));
  }
  return spreadsheet.readCell(messageData.sheetName, messageData.cell, messageData.alias);
}
function missingParameters(neededParameters, messageData, log) {
  let result = false;
  for (const parameter of neededParameters) {
    if (Object.keys(messageData).indexOf(parameter) == -1) {
      result = true;
      log.error(`The parameter '${parameter}' is required but was not passed!`);
    }
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleAppend,
  handleCreateSheet,
  handleDeleteRows,
  handleDeleteSheet,
  handleDeleteSheets,
  handleDuplicateSheet,
  handleReadCell,
  handleUpload,
  handleWriteCell,
  handleWriteCells
});
//# sourceMappingURL=messageHandlers.js.map
