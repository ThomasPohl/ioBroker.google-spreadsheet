import type { SpreadsheetUtils } from '../google';

/**
 * Handles appending data to a spreadsheet sheet.
 */
export function handleAppend(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        let sheet = messageData.sheet;
        let values = messageData.values;
        const alias = messageData.alias;
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
 * @param spreadsheet The SpreadsheetUtils instance
 * @param log The logger instance
 * @param message The message containing parameters
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
