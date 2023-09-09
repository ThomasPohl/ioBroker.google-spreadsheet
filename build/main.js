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
var import_fs = __toESM(require("fs"));
var import_google = require("./lib/google");
class GoogleSpreadsheet extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "google-spreadsheet"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.spreadsheet = new import_google.SpreadsheetUtils(this.config, this.log);
  }
  async onReady() {
    this.log.debug("config spreadsheetId: " + this.config.spreadsheetId);
    this.spreadsheet = new import_google.SpreadsheetUtils(this.config, this.log);
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
      this.log.warn("switching command: " + obj.command);
      switch (obj.command) {
        case "append": {
          this.log.debug("append to spreadsheet");
          this.append(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        case "deleteRows": {
          this.log.debug("delete rows from spreadsheet");
          this.deleteRows(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        case "createSheet": {
          this.log.debug("create sheet");
          this.createSheet(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        case "deleteSheet": {
          this.log.debug("delete sheet");
          this.deleteSheet(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        case "duplicateSheet": {
          this.log.debug("duplicate sheet");
          this.duplicateSheet(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        case "upload": {
          this.log.debug("upload file");
          this.upload(obj);
          if (obj.callback)
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          break;
        }
        default: {
          this.log.warn("unknown command: " + obj.command);
          break;
        }
      }
    }
  }
  upload(message) {
    const messageData = message.message;
    if (this.missingParameters(["source", "target", "parentFolder"], messageData)) {
      return;
    }
    this.spreadsheet.upload(messageData["source"], messageData["target"], messageData["parentFolder"], import_fs.default.createReadStream(messageData["source"]));
  }
  append(message) {
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "data"], messageData)) {
      return;
    }
    this.spreadsheet.append(messageData["sheetName"], messageData["data"]);
  }
  deleteRows(message) {
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "start", "end"], messageData)) {
      return;
    }
    this.spreadsheet.deleteRows(messageData["sheetName"], messageData["start"], messageData["end"]);
  }
  createSheet(message) {
    this.spreadsheet.createSheet(message.message);
  }
  deleteSheet(message) {
    this.spreadsheet.deleteSheet(message.message);
  }
  duplicateSheet(message) {
    const messageData = message.message;
    if (this.missingParameters(["source", "target", "index"], messageData)) {
      return;
    }
    this.spreadsheet.duplicateSheet(messageData["source"], messageData["target"], messageData["index"]);
  }
  missingParameters(neededParameters, messageData) {
    let result = false;
    for (const parameter of neededParameters) {
      if (Object.keys(messageData).indexOf(parameter) == -1) {
        result = true;
        this.log.error("The parameter '" + parameter + "' is required but was not passed!");
      }
    }
    return result;
  }
}
if (require.main !== module) {
  module.exports = (options) => new GoogleSpreadsheet(options);
} else {
  (() => new GoogleSpreadsheet())();
}
//# sourceMappingURL=main.js.map
