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
      if (obj.command === "send") {
        this.log.info("send");
        this.fetchJwt(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      }
    }
  }
  fetchJwt(config, message) {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = import_googleapis.google.sheets({ version: "v4", auth });
    sheets.spreadsheets.values.append({
      range: this.config.sheetName,
      spreadsheetId: this.config.spreadsheetId,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: prepareValues(message, this.log)
      }
    }).then(() => {
      this.log.info("Data successfully sent to google spreadsheet");
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
}
function prepareValues(message, log) {
  log.info("Type: " + message.message.constructor.toString());
  if (Array.isArray(message.message)) {
    log.info("is Array");
    return [message.message];
  } else {
    log.info("Message: " + JSON.stringify(message));
    return [[message.message]];
  }
}
if (require.main !== module) {
  module.exports = (options) => new GoogleSpreadsheet(options);
} else {
  (() => new GoogleSpreadsheet())();
}
//# sourceMappingURL=main.js.map
