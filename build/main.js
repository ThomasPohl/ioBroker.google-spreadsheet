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
var import_fs = __toESM(require("fs"));
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
      } else if (obj.command === "createSheet") {
        this.log.info("create sheet");
        this.createSheet(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      } else if (obj.command === "deleteSheet") {
        this.log.info("delete sheet");
        this.deleteSheet(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      } else if (obj.command === "duplicateSheet") {
        this.log.info("duplicate sheet");
        this.duplicateSheet(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      } else if (obj.command === "upload") {
        this.log.info("upload file");
        this.upload(this.config, obj);
        if (obj.callback)
          this.sendTo(obj.from, obj.command, "Message received", obj.callback);
      } else {
        this.log.warn("unknown command: " + obj.command);
      }
    }
  }
  append(config, message) {
    const sheets = this.init();
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "data"], messageData)) {
      return;
    }
    sheets.spreadsheets.values.append({
      range: messageData["sheetName"],
      spreadsheetId: this.config.spreadsheetId,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: this.prepareValues(messageData["data"])
      }
    }).then(() => {
      this.log.info("Data successfully sent to google spreadsheet");
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  prepareValues(message) {
    if (Array.isArray(message)) {
      this.log.info("is Array");
      return [message];
    } else {
      this.log.info("Message: " + JSON.stringify(message));
      return [[message]];
    }
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
  deleteRows(config, message) {
    this.log.info("Message: " + JSON.stringify(message));
    const sheets = this.init();
    const messageData = message.message;
    if (this.missingParameters(["sheetName", "start", "end"], messageData)) {
      return;
    }
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == messageData["sheetName"]);
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
  init() {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.config.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    return import_googleapis.google.sheets({ version: "v4", auth });
  }
  createSheet(config, message) {
    const sheets = this.init();
    sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.config.spreadsheetId,
      requestBody: {
        requests: [{ addSheet: {
          properties: {
            title: message.message
          }
        } }]
      }
    }).then(() => {
      this.log.info("Sheet created successfully");
    }).catch((error) => {
      this.log.error("Error while creating sheet:" + error);
    });
  }
  deleteSheet(config, message) {
    const sheets = this.init();
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == message.message);
        if (sheet && sheet.properties) {
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests: [{
                deleteSheet: {
                  sheetId: sheet.properties.sheetId
                }
              }]
            }
          }).then(() => {
            this.log.info("Data successfully sent to google spreadsheet");
          }).catch((error) => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
          });
        }
      }
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  duplicateSheet(config, message) {
    const sheets = this.init();
    const messageData = message.message;
    if (this.missingParameters(["source", "target", "index"], messageData)) {
      return;
    }
    sheets.spreadsheets.get({ spreadsheetId: this.config.spreadsheetId }).then((spreadsheet) => {
      if (spreadsheet && spreadsheet.data.sheets) {
        const sheet = spreadsheet.data.sheets.find((sheet2) => sheet2.properties && sheet2.properties.title == messageData["source"]);
        if (sheet && sheet.properties) {
          let insertIndex = messageData["index"];
          if (insertIndex == -1 || insertIndex == void 0) {
            insertIndex = spreadsheet.data.sheets.length;
          }
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.config.spreadsheetId,
            requestBody: {
              requests: [{
                duplicateSheet: {
                  sourceSheetId: sheet.properties.sheetId,
                  newSheetName: messageData["target"],
                  insertSheetIndex: insertIndex
                }
              }]
            }
          }).then(() => {
            this.log.info("Data successfully sent to google spreadsheet");
          }).catch((error) => {
            this.log.error("Error while sending data to Google Spreadsheet:" + error);
          });
        } else {
          this.log.warn("Cannot find sheet: " + messageData["source"]);
        }
      }
    }).catch((error) => {
      this.log.error("Error while sending data to Google Spreadsheet:" + error);
    });
  }
  upload(config, message) {
    const auth = new import_google_auth_library.JWT({
      email: this.config.serviceAccountEmail,
      key: this.config.privateKey,
      scopes: ["https://www.googleapis.com/auth/drive.file"]
    });
    const driveapi = import_googleapis.google.drive({ version: "v3", auth });
    const messageData = message.message;
    if (this.missingParameters(["source", "target", "parentFolder"], messageData)) {
      return;
    }
    driveapi.files.create({
      requestBody: {
        parents: [messageData["parentFolder"]],
        name: messageData["target"]
      },
      media: {
        mimeType: "application/octet-stream",
        body: import_fs.default.createReadStream(messageData["source"])
      },
      fields: "id"
    }).then(() => {
      this.log.info("Data successfully uploaded to google spreadsheet");
    }).catch((error) => {
      this.log.error("Error while uploading data to Google Spreadsheet:" + error);
    });
  }
}
if (require.main !== module) {
  module.exports = (options) => new GoogleSpreadsheet(options);
} else {
  (() => new GoogleSpreadsheet())();
}
//# sourceMappingURL=main.js.map
