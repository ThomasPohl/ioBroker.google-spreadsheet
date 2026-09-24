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
var validation_exports = {};
__export(validation_exports, {
  isValidCellPattern: () => isValidCellPattern,
  normalizeCellReference: () => normalizeCellReference,
  normalizeLegacyMessage: () => normalizeLegacyMessage,
  preferValue: () => preferValue
});
module.exports = __toCommonJS(validation_exports);
function preferValue(primary, fallback) {
  return primary !== void 0 && primary !== null ? primary : fallback;
}
function normalizeCellReference(cell) {
  if (cell.startsWith("'") && cell.endsWith("'")) {
    return cell.substring(1, cell.length - 1);
  }
  return cell;
}
function isValidCellPattern(cell) {
  return /^[A-Z]+[0-9]+$/i.test(cell);
}
function normalizeLegacyMessage(messageData) {
  const normalized = { ...messageData };
  if (!normalized.sheet && normalized.sheetName) {
    normalized.sheet = normalized.sheetName;
  }
  if (!normalized.range && normalized.cellRange) {
    normalized.range = normalized.cellRange;
  }
  if (typeof normalized.value === "undefined" && typeof normalized.data !== "undefined") {
    normalized.value = normalized.data;
  }
  if (typeof normalized.values === "undefined" && typeof normalized.data !== "undefined") {
    normalized.values = normalized.data;
  }
  return normalized;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValidCellPattern,
  normalizeCellReference,
  normalizeLegacyMessage,
  preferValue
});
//# sourceMappingURL=validation.js.map
