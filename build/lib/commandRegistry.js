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
var commandRegistry_exports = {};
__export(commandRegistry_exports, {
  COMMAND_REGISTRY: () => COMMAND_REGISTRY
});
module.exports = __toCommonJS(commandRegistry_exports);
var import_messageHandlers = require("./messageHandlers");
const COMMAND_REGISTRY = {
  append: { handler: import_messageHandlers.handleAppend, logMessage: "append to spreadsheet" },
  deleteRows: { handler: import_messageHandlers.handleDeleteRows, logMessage: "delete rows from spreadsheet" },
  createSheet: { handler: import_messageHandlers.handleCreateSheet, logMessage: "create sheet" },
  deleteSheet: { handler: import_messageHandlers.handleDeleteSheet, logMessage: "delete sheet" },
  deleteSheets: { handler: import_messageHandlers.handleDeleteSheets, logMessage: "delete sheets" },
  duplicateSheet: { handler: import_messageHandlers.handleDuplicateSheet, logMessage: "duplicate sheet" },
  getLastRow: { handler: import_messageHandlers.handleGetLastRow, logMessage: "get last row" },
  createChart: { handler: import_messageHandlers.handleCreateChart, logMessage: "create chart" },
  updateChart: { handler: import_messageHandlers.handleUpdateChart, logMessage: "update chart" },
  upload: { handler: import_messageHandlers.handleUpload, logMessage: "upload file" },
  writeCell: { handler: import_messageHandlers.handleWriteCell, logMessage: "write cell" },
  writeCells: { handler: import_messageHandlers.handleWriteCells, logMessage: "write cells" },
  readCell: { handler: import_messageHandlers.handleReadCell, logMessage: "read cell" },
  readRange: { handler: import_messageHandlers.handleReadRange, logMessage: "read range" },
  writeRange: { handler: import_messageHandlers.handleWriteRange, logMessage: "write range" },
  clearRange: { handler: import_messageHandlers.handleClearRange, logMessage: "clear range" },
  setCellFormat: { handler: import_messageHandlers.handleSetCellFormat, logMessage: "set cell format" }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COMMAND_REGISTRY
});
//# sourceMappingURL=commandRegistry.js.map
