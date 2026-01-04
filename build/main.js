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
var import_google = require("./lib/google");
var import_messageHandlers = require("./lib/messageHandlers");
class GoogleSpreadsheet extends utils.Adapter {
  /**
   * Creates an instance of the adapter class.
   *
   * @param options The adapter options
   */
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
          this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, data).then(() => {
            this.log.info("privateKey is stored now encrypted");
          }).catch((err) => {
            this.log.error(`Cannot store encrypted privateKey: ${err}`);
          });
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
  /**
   * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
   * Using this method requires "common.messagebox" property to be set to true in io-package.json
   *
   * @param obj The message object
   */
  onMessage(obj) {
    const handlers = {
      append: { handler: import_messageHandlers.handleAppend, logMessage: "append to spreadsheet" },
      deleteRows: { handler: import_messageHandlers.handleDeleteRows, logMessage: "delete rows from spreadsheet" },
      createSheet: { handler: import_messageHandlers.handleCreateSheet, logMessage: "create sheet" },
      deleteSheet: { handler: import_messageHandlers.handleDeleteSheet, logMessage: "delete sheet" },
      deleteSheets: { handler: import_messageHandlers.handleDeleteSheets, logMessage: "delete sheets" },
      duplicateSheet: { handler: import_messageHandlers.handleDuplicateSheet, logMessage: "duplicate sheet" },
      upload: { handler: import_messageHandlers.handleUpload, logMessage: "upload file" },
      writeCell: { handler: import_messageHandlers.handleWriteCell, logMessage: "write cell" },
      writeCells: { handler: import_messageHandlers.handleWriteCells, logMessage: "write cells" },
      readCell: { handler: import_messageHandlers.handleReadCell, logMessage: "read cell" }
    };
    this.log.debug(`Received message: ${JSON.stringify(obj)}`);
    if (typeof obj === "object" && obj.message) {
      if (obj.command && obj.command in handlers) {
        const command = obj.command;
        this.log.debug(handlers[command].logMessage);
        handlers[command].handler(this.spreadsheet, this.log, obj).then((result) => {
          if (obj.callback) {
            this.sendTo(obj.from, obj.command, result ? result : "Message received", obj.callback);
          }
        }).catch((error) => {
          this.log.error(`Cannot ${obj.command}: ${error}`);
        });
      } else {
        this.log.warn(`unknown command: ${obj.command}`);
      }
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new GoogleSpreadsheet(options);
} else {
  (() => new GoogleSpreadsheet())();
}
//# sourceMappingURL=main.js.map
