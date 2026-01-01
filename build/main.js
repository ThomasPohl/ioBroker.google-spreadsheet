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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
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
  migrateSpreadhseetIdToTableIfNeeded() {
    if (this.config.spreadsheetId && this.config.spreadsheetId.length > 0 && (!this.config.spreadsheets || this.config.spreadsheets.length === 0)) {
      this.log.info(`Migrating spreadsheetId ${this.config.spreadsheetId} to spreadsheets table`);
      this.config.spreadsheets = [
        {
          spreadsheetId: this.config.spreadsheetId,
          alias: "default",
          isDefault: true
        }
      ];
      this.config.spreadsheetId = "";
      this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, { native: this.config }, () => {
        this.log.info("Migration completed");
      });
    }
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    this.migrateSpreadhseetIdToTableIfNeeded();
    this.log.debug(`config spreadsheetId: ${this.config.spreadsheetId}`);
    if (this.config.privateKey && this.config.serviceAccountEmail && this.config.spreadsheets.length > 0) {
      await this.setState("info.connection", true, true);
      this.log.info("Google-spreadsheet adapter configured");
    } else {
      await this.setState("info.connection", false, true);
      this.log.warn("Google-spreadsheet adapter not configured");
    }
    await this.encryptPrivateKeyIfNeeded();
    this.spreadsheet = new import_google.SpreadsheetUtils(this.config, this.log);
  }
  async encryptPrivateKeyIfNeeded() {
    if (this.config.privateKey && this.config.privateKey.length > 0) {
      await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`).then((data) => {
        if (data && data.native && data.native.privateKey && !data.native.privateKey.startsWith("$/aes")) {
          this.config.privateKey = data.native.privateKey;
          data.native.privateKey = this.encrypt(data.native.privateKey);
          this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, data);
          this.log.info("privateKey is stored now encrypted");
        }
      });
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   *
   * @param callback Callback so the adapter can shut down
   */
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      this.log.error(`Error during unload: ${JSON.stringify(e)}`);
      callback();
    }
  }
  // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
  // /**
  //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
  //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
  //  */
  onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      switch (obj.command) {
        case "append": {
          this.log.debug("append to spreadsheet");
          this.append(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "deleteRows": {
          this.log.debug("delete rows from spreadsheet");
          this.deleteRows(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "createSheet": {
          this.log.debug("create sheet");
          this.createSheet(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "deleteSheet": {
          this.log.debug("delete sheet");
          this.deleteSheet(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "deleteSheets": {
          this.log.debug("delete sheet");
          this.deleteSheets(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "duplicateSheet": {
          this.log.debug("duplicate sheet");
          this.duplicateSheet(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "upload": {
          this.log.debug("upload file");
          this.upload(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "writeCell": {
          this.log.debug("write data to single cell");
          this.writeCell(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "writeCells": {
          this.log.debug("write data to multiple cells");
          this.writeCells(obj);
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, "Message received", obj.callback);
          }
          break;
        }
        case "readCell": {
          this.log.debug("read single cell");
          this.readCell(obj).then((result) => {
            if (obj.callback) {
              this.sendTo(obj.from, obj.command, result, obj.callback);
            }
          }).catch((error) => this.log.error(`Cannot read cell: ${error}`));
          break;
        }
        default: {
          this.log.warn(`unknown command: ${obj.command}`);
          break;
        }
      }
    }
  }
  upload(message) {
    const messageData = message.message;
    if (this.missingParameters(["target", "parentFolder"], messageData)) {
      return;
    }
    this.spreadsheet.upload(messageData.target, messageData.parentFolder, import_fs.default.createReadStream(messageData.source));
  }
  append(message) {
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "data"], messageData)) {
      return;
    }
    this.spreadsheet.append(messageData.sheetName, messageData.data, messageData.alias);
  }
  writeCell(message) {
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "cell", "data"], messageData)) {
      return;
    }
    const cellPattern = new RegExp("[A-Z]+[0-9]+()");
    if (!cellPattern.test(messageData.cell)) {
      this.log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
      return;
    }
    this.spreadsheet.writeCell(messageData.sheetName, messageData.cell, messageData.data, messageData.alias);
  }
  writeCells(message) {
    const messageData = message.message;
    if (this.missingParameters(["cells"], messageData)) {
      return;
    }
    const cells = messageData.cells;
    const cellPattern = new RegExp("[A-Z]+[0-9]+()");
    for (const cellObj of cells) {
      if (!cellPattern.test(cellObj.cell)) {
        this.log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
        return;
      }
    }
    this.spreadsheet.writeCells(cells, messageData.alias);
  }
  async readCell(message) {
    return new Promise((resolve, reject) => {
      const messageData = message.message;
      if (this.missingParameters(["sheetName", "cell"], messageData)) {
        return;
      }
      const cellPattern = new RegExp("[A-Z]+[0-9]+()");
      if (!cellPattern.test(messageData.cell)) {
        this.log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
        return;
      }
      this.spreadsheet.readCell(messageData.sheetName, messageData.cell, messageData.alias).then((result) => resolve(result)).catch((error) => reject(new Error(error)));
    });
  }
  deleteRows(message) {
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "start", "end"], messageData)) {
      return;
    }
    this.spreadsheet.deleteRows(messageData.sheetName, messageData.start, messageData.end, messageData.alias);
  }
  createSheet(message) {
    if (typeof message.message === "string") {
      this.log.warn("Deprecated call of createSheet with string as message. Please use object with title and optional alias!");
      this.spreadsheet.createSheet(message.message, null);
    } else {
      const messageData = message.message;
      if (this.missingParameters(["title"], messageData)) {
        return;
      }
      this.spreadsheet.createSheet(messageData.title, messageData.alias);
    }
  }
  deleteSheet(message) {
    if (typeof message.message === "string") {
      this.log.warn("Deprecated call of deleteSheet with non-string as message. Please use object with sheetName and optional alias!");
      this.spreadsheet.deleteSheet(message.message);
    } else {
      const messageData = message.message;
      if (this.missingParameters(["sheetName"], messageData)) {
        return;
      }
      this.spreadsheet.deleteSheet(messageData.sheetName, messageData.alias);
    }
  }
  deleteSheets(message) {
    if (Array.isArray(message.message)) {
      this.log.warn("Deprecated call of deleteSheets with array as message. Please use object with sheetNames and optional alias!");
      this.spreadsheet.deleteSheets(message.message, null);
    } else {
      const messageData = message.message;
      if (this.missingParameters(["sheetNames"], messageData)) {
        return;
      }
      this.spreadsheet.deleteSheets(messageData.sheetNames, messageData.alias);
    }
  }
  duplicateSheet(message) {
    const messageData = message.message;
    if (this.missingParameters(["source", "target", "index"], messageData)) {
      return;
    }
    this.spreadsheet.duplicateSheet(messageData.source, messageData.target, messageData.index, messageData.alias);
  }
  missingParameters(neededParameters, messageData) {
    let result = false;
    for (const parameter of neededParameters) {
      if (Object.keys(messageData).indexOf(parameter) == -1) {
        result = true;
        this.log.error(`The parameter '${parameter}' is required but was not passed!`);
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
