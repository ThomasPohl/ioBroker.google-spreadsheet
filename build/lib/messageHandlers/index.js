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
  handleCreateSheet: () => import_sheetHandlers.handleCreateSheet,
  handleDeleteRows: () => import_sheetHandlers.handleDeleteRows,
  handleDeleteSheet: () => import_sheetHandlers.handleDeleteSheet,
  handleDeleteSheets: () => import_sheetHandlers.handleDeleteSheets,
  handleDuplicateSheet: () => import_sheetHandlers.handleDuplicateSheet,
  handleReadCell: () => import_cellHandlers.handleReadCell,
  handleUpload: () => import_uploadHandlers.handleUpload,
  handleWriteCell: () => import_cellHandlers.handleWriteCell,
  handleWriteCells: () => import_cellHandlers.handleWriteCells
});
module.exports = __toCommonJS(messageHandlers_exports);
var import_sheetHandlers = require("./sheetHandlers");
var import_cellHandlers = require("./cellHandlers");
var import_uploadHandlers = require("./uploadHandlers");
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
//# sourceMappingURL=index.js.map
