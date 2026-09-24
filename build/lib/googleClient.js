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
var googleClient_exports = {};
__export(googleClient_exports, {
  GoogleClient: () => GoogleClient
});
module.exports = __toCommonJS(googleClient_exports);
var import_googleapis = require("googleapis");
class GoogleClient {
  constructor(config, log) {
    this.config = config;
    this.log = log;
  }
  sheetsClient = null;
  driveClient = null;
  getSheetsClient() {
    if (!this.sheetsClient) {
      const auth = new import_googleapis.google.auth.GoogleAuth({
        credentials: {
          client_email: this.config.serviceAccountEmail,
          private_key: this.formatPrivateKey(this.config.privateKey)
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      });
      this.sheetsClient = import_googleapis.google.sheets({ version: "v4", auth });
    }
    return this.sheetsClient;
  }
  getDriveClient() {
    if (!this.driveClient) {
      const auth = new import_googleapis.google.auth.GoogleAuth({
        credentials: {
          client_email: this.config.serviceAccountEmail,
          private_key: this.formatPrivateKey(this.config.privateKey)
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      });
      this.driveClient = import_googleapis.google.drive({ version: "v3", auth });
    }
    return this.driveClient;
  }
  getSpreadsheetId(sheetAlias) {
    var _a, _b;
    if (sheetAlias) {
      const sheet = (_a = this.config.spreadsheets) == null ? void 0 : _a.find((s) => s.alias === sheetAlias);
      if (sheet) {
        return sheet.spreadsheetId;
      }
      this.log.warn(`No spreadsheet found for alias ${sheetAlias}, using default spreadsheetId`);
    }
    const defaultSheet = (_b = this.config.spreadsheets) == null ? void 0 : _b.find((s) => s.isDefault);
    if (defaultSheet) {
      return defaultSheet.spreadsheetId;
    }
    throw new Error("No default spreadsheetId found in configuration");
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
  GoogleClient
});
//# sourceMappingURL=googleClient.js.map
