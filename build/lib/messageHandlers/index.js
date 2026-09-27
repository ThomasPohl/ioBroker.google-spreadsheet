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
var messageHandlers_exports = {};
__export(messageHandlers_exports, {
  handleAppend: () => import_sheetHandlers.handleAppend,
  handleClearRange: () => import_cellHandlers.handleClearRange,
  handleCreateChart: () => import_sheetHandlers.handleCreateChart,
  handleCreateSheet: () => import_sheetHandlers.handleCreateSheet,
  handleDeleteRows: () => import_sheetHandlers.handleDeleteRows,
  handleDeleteSheet: () => import_sheetHandlers.handleDeleteSheet,
  handleDeleteSheets: () => import_sheetHandlers.handleDeleteSheets,
  handleDuplicateSheet: () => import_sheetHandlers.handleDuplicateSheet,
  handleGetLastRow: () => import_sheetHandlers.handleGetLastRow,
  handleReadCell: () => import_cellHandlers.handleReadCell,
  handleReadRange: () => import_cellHandlers.handleReadRange,
  handleSetCellFormat: () => import_cellHandlers.handleSetCellFormat,
  handleUpdateChart: () => import_sheetHandlers.handleUpdateChart,
  handleUpload: () => import_uploadHandlers.handleUpload,
  handleWriteCell: () => import_cellHandlers.handleWriteCell,
  handleWriteCells: () => import_cellHandlers.handleWriteCells,
  handleWriteRange: () => import_cellHandlers.handleWriteRange
});
module.exports = __toCommonJS(messageHandlers_exports);
var import_sheetHandlers = require("./sheetHandlers");
var import_cellHandlers = require("./cellHandlers");
var import_uploadHandlers = require("./uploadHandlers");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleAppend,
  handleClearRange,
  handleCreateChart,
  handleCreateSheet,
  handleDeleteRows,
  handleDeleteSheet,
  handleDeleteSheets,
  handleDuplicateSheet,
  handleGetLastRow,
  handleReadCell,
  handleReadRange,
  handleSetCellFormat,
  handleUpdateChart,
  handleUpload,
  handleWriteCell,
  handleWriteCells,
  handleWriteRange
});
//# sourceMappingURL=index.js.map
