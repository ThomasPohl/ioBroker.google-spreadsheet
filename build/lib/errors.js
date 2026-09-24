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
var errors_exports = {};
__export(errors_exports, {
  ensureRequired: () => ensureRequired,
  wrapGoogleError: () => wrapGoogleError
});
module.exports = __toCommonJS(errors_exports);
function wrapGoogleError(operation, error) {
  const message = error && typeof error === "object" && "message" in error ? String(error.message) : String(error != null ? error : "Unknown error");
  return new Error(`${operation}: ${message}`);
}
function ensureRequired(value, label) {
  if (value === void 0 || value === null || value === "") {
    throw new Error(`Missing parameters for ${label}`);
  }
  return value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ensureRequired,
  wrapGoogleError
});
//# sourceMappingURL=errors.js.map
