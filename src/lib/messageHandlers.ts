import type { SpreadsheetUtils } from './google';
import fs from 'fs';

/**
 * Handles appending data to a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet, values and optional alias
 * @returns Promise that resolves on success
 */
export function handleAppend(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        // Konsistente Parameternamen: sheet, values, alias
        let sheet = messageData.sheet;
        let values = messageData.values;
        const alias = messageData.alias;
        // Consistent parameter names: sheet, values, alias
        // Backward compatibility
        if (!sheet && messageData.sheetName) {
            log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
            sheet = messageData.sheetName;
        }
        if (!values && messageData.data) {
            log.warn("Parameter 'data' is deprecated, please use 'values' instead!");
            values = messageData.data;
        }
        if (!sheet || !values) {
            log.error("Missing parameters for append: 'sheet' and/or 'values'");
            reject(new Error('Missing parameters for append'));
            return;
        }
        spreadsheet
            .append(sheet, values, alias)
            .then(() => resolve())
            .catch(error => reject(new Error(error)));
    });
}

/**
 * Handles deleting rows in a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet, start, end and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteRows(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        let sheet = messageData.sheet;
        const start = messageData.start;
        const end = messageData.end;
        const alias = messageData.alias;
        if (!sheet && messageData.sheetName) {
            log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
            sheet = messageData.sheetName;
        }
        if (!sheet || typeof start !== 'number' || typeof end !== 'number') {
            log.error("Missing parameters for deleteRows: 'sheet', 'start', 'end'");
            reject(new Error('Missing parameters for deleteRows'));
            return;
        }
        spreadsheet
            .deleteRows(sheet, start, end, alias)
            .then(() => resolve())
            .catch(error => reject(new Error(error)));
    });
}

/**
 * Handles creating a new spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet and optional alias
 * @returns Promise that resolves on success
 */
export function handleCreateSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (typeof message.message === 'string') {
        log.warn('Deprecated call of createSheet with string as message. Please use an object with sheet!');
        return spreadsheet.createSheet(message.message, null);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    let sheet = messageData.sheet;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
        log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
        sheet = messageData.sheetName;
    }
    if (!sheet) {
        log.error("Missing parameter for createSheet: 'sheet'");
        return Promise.reject(new Error('Missing parameters for createSheet'));
    }
    return spreadsheet.createSheet(sheet, alias);
}

/**
 * Handles deleting a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (typeof message.message === 'string') {
        log.warn('Deprecated call of deleteSheet with string as message. Please use an object with sheet!');
        return spreadsheet.deleteSheet(message.message);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    let sheet = messageData.sheet;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
        log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
        sheet = messageData.sheetName;
    }
    if (!sheet) {
        log.error("Missing parameter for deleteSheet: 'sheet'");
        return Promise.reject(new Error('Missing parameters for deleteSheet'));
    }
    return spreadsheet.deleteSheet(sheet, alias);
}

/**
 * Handles deleting multiple spreadsheet sheets.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheets (array) and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteSheets(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (Array.isArray(message.message)) {
        log.warn('Deprecated call of deleteSheets with array as message. Please use an object with sheets!');
        return spreadsheet.deleteSheets(message.message as string[], null);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    let sheets = messageData.sheets;
    const alias = messageData.alias;
    if (!sheets && messageData.sheetNames) {
        log.warn("Parameter 'sheetNames' is deprecated, please use 'sheets' instead!");
        sheets = messageData.sheetNames;
    }
    if (!sheets) {
        log.error("Missing parameter for deleteSheets: 'sheets'");
        return Promise.reject(new Error('Missing parameters for deleteSheets'));
    }
    return spreadsheet.deleteSheets(sheets, alias);
}

/**
 * Handles duplicating a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with source, target, index and optional alias
 * @returns Promise that resolves on success
 */
export function handleDuplicateSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    const source = messageData.source;
    const target = messageData.target;
    const index = messageData.index;
    const alias = messageData.alias;
    if (!source || !target || typeof index !== 'number') {
        log.error("Missing parameters for duplicateSheet: 'source', 'target', 'index'");
        return Promise.reject(new Error('Missing parameters for duplicateSheet'));
    }
    return spreadsheet.duplicateSheet(source, target, index, alias);
}

/**
 * Handles uploading a file to a Google Drive folder.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with target, parentFolder and source
 * @returns Promise that resolves on success
 */
export function handleUpload(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    const target = messageData.target;
    const parentFolder = messageData.parentFolder;
    const source = messageData.source;
    if (!target || !parentFolder || !source) {
        log.error("Missing parameters for upload: 'target', 'parentFolder', 'source'");
        return Promise.reject(new Error('Missing parameters for upload'));
    }
    return spreadsheet.upload(target, parentFolder, fs.createReadStream(source));
}

/**
 * Handles writing to a single cell of a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet, cell, value and optional alias
 * @returns Promise that resolves on success
 */
export function handleWriteCell(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    let sheet = messageData.sheet;
    const cell = messageData.cell;
    let value = messageData.value;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
        log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
        sheet = messageData.sheetName;
    }
    if (!value && messageData.data) {
        log.warn("Parameter 'data' is deprecated, please use 'value' instead!");
        value = messageData.data;
    }
    if (!sheet || !cell || typeof value === 'undefined') {
        log.error("Missing parameters for writeCell: 'sheet', 'cell', 'value'");
        return Promise.reject(new Error('Missing parameters for writeCell'));
    }
    const cellPattern = new RegExp('^[A-Z]+[0-9]+$');
    if (!cellPattern.test(cell)) {
        log.error(`Invalid cell pattern ${cell}. Expected: A1`);
        return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
    }
    return spreadsheet.writeCell(sheet, cell, value, alias);
}

/**
 * Handles writing to multiple cells of one or more spreadsheet sheets.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with cells (array of {sheet, cell, value}) and optional alias
 * @returns Promise that resolves on success
 */
export function handleWriteCells(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    const cells = messageData.cells;
    const alias = messageData.alias;
    if (!cells) {
        log.error("Missing parameter for writeCells: 'cells'");
        return Promise.reject(new Error('Missing parameters for writeCells'));
    }
    // Future: cells = [{sheet, cell, value}]
    const cellPattern = new RegExp('^[A-Z]+[0-9]+$');
    for (const cellObj of cells) {
        if (!cellObj.sheet && cellObj.sheetName) {
            log.warn("Parameter 'sheetName' in cells is deprecated, please use 'sheet' instead!");
            cellObj.sheet = cellObj.sheetName;
        }
        if (!cellObj.value && typeof cellObj.data !== 'undefined') {
            log.warn("Parameter 'data' in cells is deprecated, please use 'value' instead!");
            cellObj.value = cellObj.data;
        }
        if (!cellObj.sheet || !cellObj.cell || typeof cellObj.value === 'undefined') {
            log.error("Missing parameters for writeCells: 'sheet', 'cell', 'value' in cells");
            return Promise.reject(new Error('Missing parameters for writeCells'));
        }
        if (!cellPattern.test(cellObj.cell)) {
            log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
            return Promise.reject(new Error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`));
        }
    }
    return spreadsheet.writeCells(cells, alias);
}

/**
 * Handles reading a single cell of a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheet, cell and optional alias
 * @returns Promise that resolves with the read value
 */
export function handleReadCell(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<any> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    let sheet = messageData.sheet;
    const cell = messageData.cell;
    const alias = messageData.alias;
    if (!sheet && messageData.sheetName) {
        log.warn("Parameter 'sheetName' is deprecated, please use 'sheet' instead!");
        sheet = messageData.sheetName;
    }
    if (!sheet || !cell) {
        log.error("Missing parameters for readCell: 'sheet', 'cell'");
        return Promise.reject(new Error('Missing parameters for readCell'));
    }
    const cellPattern = new RegExp('^[A-Z]+[0-9]+$');
    if (!cellPattern.test(cell)) {
        log.error(`Invalid cell pattern ${cell}. Expected: A1`);
        return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
    }
    return spreadsheet.readCell(sheet, cell, alias);
}
