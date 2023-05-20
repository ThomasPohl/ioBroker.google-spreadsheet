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
const request = require("request");
class GoogleSpreadsheet extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "google-spreadsheet"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
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
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
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
    var jwtClient = new import_googleapis.Auth.JWT(
      this.config.serviceAccountEmail,
      void 0,
      this.config.privateKey.split("\\n").join("\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    this.log.info("Fetching jwt");
    const log = this.log;
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        log.error(err.message);
        return;
      }
      if (!tokens) {
        return;
      }
      log.info("Successfully fetched jwt");
      var accessToken = tokens.access_token;
      var url = "https://sheets.googleapis.com/v4/spreadsheets/" + config.spreadsheetId + "/values/" + encodeURIComponent(config.sheetName) + ":append?valueInputOption=RAW";
      var options = {
        url,
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken
        },
        json: {
          values: prepareValues(message, log)
        }
      };
      log.info("Appending to spreadsheet: " + JSON.stringify(options));
      request(options, function(error, response, body) {
        if (error) {
          log.error("Fehler beim Senden der Daten an Google Spreadsheet:" + error);
        } else if (response.statusCode !== 200) {
          log.error("Fehler beim Senden der Daten an Google Spreadsheet. Statuscode:" + response.statusCode);
        } else {
          log.info("Daten erfolgreich an Google Spreadsheet gesendet");
        }
      });
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
