import type { SpreadsheetUtils } from '../google';
import { normalizeLegacyMessage, preferValue } from '../validation';

/**
 * Handles appending data to a spreadsheet sheet.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
 */
export function handleAppend(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
        const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
        const values = preferValue(messageData.values, messageData.data);
        const alias = messageData.alias;
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
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
 */
export function handleDeleteRows(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
        const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
        const start = messageData.start;
        const end = messageData.end;
        const alias = messageData.alias;
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
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const alias = messageData.alias;
    if (!sheet) {
        log.error("Missing parameter for createSheet: 'sheet'");
        return Promise.reject(new Error('Missing parameters for createSheet'));
    }
    return spreadsheet.createSheet(sheet, alias);
}

/**
 * Handles deleting a spreadsheet sheet.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
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
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const alias = messageData.alias;
    if (!sheet) {
        log.error("Missing parameter for deleteSheet: 'sheet'");
        return Promise.reject(new Error('Missing parameters for deleteSheet'));
    }
    return spreadsheet.deleteSheet(sheet, alias);
}

/**
 * Handles deleting multiple spreadsheet sheets.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
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
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheets = preferValue(messageData.sheets, messageData.sheetNames) as string[] | undefined;
    const alias = messageData.alias;
    if (!sheets) {
        log.error("Missing parameter for deleteSheets: 'sheets'");
        return Promise.reject(new Error('Missing parameters for deleteSheets'));
    }
    return spreadsheet.deleteSheets(sheets, alias);
}

/**
 * Handles duplicating a spreadsheet sheet.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
 */
export function handleDuplicateSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
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
 * Handles retrieving the number of the last non-empty row in a sheet.
 *
 * @param spreadsheet The SpreadsheetUtils instance
 * @param log The logger instance
 * @param message The message containing parameters
 */
export function handleGetLastRow(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<number> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const alias = messageData.alias;
    if (!sheet) {
        log.error("Missing parameter for getLastRow: 'sheet'");
        return Promise.reject(new Error('Missing parameters for getLastRow'));
    }
    return spreadsheet.getLastRow(sheet, alias);
}

/**
 * Handles creating a chart in a spreadsheet sheet.
 */
export function handleCreateChart(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const chart = messageData.chart || messageData;
    const alias = messageData.alias;
    if (!sheet || !chart.range) {
        log.error("Missing parameters for createChart: 'sheet', 'chart.range'");
        return Promise.reject(new Error('Missing parameters for createChart'));
    }
    return spreadsheet.createChart(sheet, chart, alias);
}

/**
 * Handles updating an existing chart in a spreadsheet sheet.
 */
export function handleUpdateChart(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const chart = messageData.chart || messageData;
    const alias = messageData.alias;
    const chartId = messageData.chartId ?? messageData.id;
    if (!sheet || !chart.range || chartId === undefined) {
        log.error("Missing parameters for updateChart: 'sheet', 'chart.range', 'chartId'");
        return Promise.reject(new Error('Missing parameters for updateChart'));
    }
    return spreadsheet.updateChart(sheet, Number(chartId), chart, alias);
}
