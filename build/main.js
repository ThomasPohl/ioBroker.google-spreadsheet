"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_googleapis = require("googleapis");
var import_google_auth_library = require("google-auth-library");
class GoogleSpreadsheet extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "google-spreadsheet"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("config spreadsheetId: " + this.config.spreadsheetId);
    this.log.info("config sheetName: " + this.config.sheetName);
  }
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      callback();
    }
  }
  onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "append") {
        this.log.info("append to spreadsheet");
        this.append(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      } else if (obj.command === "deleteRows") {
        this.log.info("delete rows from spreadsheet");
        this.deleteRows(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      }
    }
  }
  append(config, message) {
    const sheets = this.createSheet();
    sheets.spreadsheets.values.append({
      range: this.config.sheetName,
      spreadsheetId: this.config.spreadsheetId,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: this.prepareValues(message)
      }
    }).then(() => {
      this.log.info("Data successfully sent to google spreadsheet");
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  prepareValues(message) {
    if (Array.isArray(message.message)) {
      this.log.info("is Array");
      return [message.message];
    } else {
      this.log.info("Message: " + JSON.stringify(message));
      return [[message.message]];
    }
  }
  deleteRows(config, message) {
    this.log.info("Message: " + JSON.stringify(message));
    const sheets = this.createSheet();
    const messageData = message.message;
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == this.config.sheetName);
        if (sheet && sheet.properties) {
          const sheetId = sheet.properties.sheetId;
          sheets.spreadsheets.batchUpdate(
            {
              spreadsheetId: this.config.spreadsheetId,
              requestBody: {
                requests: [{
                  deleteDimension: {
                    range: {
                      dimension: "ROWS",
                      endIndex: messageData["end"],
                      sheetId,
                      startIndex: messageData["start"] - 1
                    }
                  }
                }]
              }
            }
          ).then(() => {
            this.log.info("Rows successfully deleted from google spreadsheet");
          }).catch((error) => {
            this.log.error("Error while deleting rows from Google Spreadsheet:" + error);
          });
        }
      }
    });
  }
  createSheet() {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return import_googleapis.google.sheets({ version: "v4", auth });
  }
}
if (require.main !== module) {
  module.exports = (options) => new GoogleSpreadsheet(options);
} else {
  (() => new GoogleSpreadsheet())();
}
//# sourceMappingURL=main.js.map
