import type { SpreadsheetUtils } from '../google';

/**
 * Handles writing to a single cell of a spreadsheet sheet.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
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
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
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
 * Returns the value of the cell.
 *
 * @param spreadsheet The SpreadsheetUtils instance to use.
 * @param log The logger instance for logging.
 * @param message The message containing parameters for the operation.
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
