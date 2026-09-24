import type { SpreadsheetUtils } from '../google';
import { isValidCellPattern, normalizeLegacyMessage, preferValue } from '../validation';

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
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const cell = messageData.cell;
    const value = preferValue(messageData.value, messageData.data);
    const alias = messageData.alias;

    if (!sheet || !cell || typeof value === 'undefined') {
        log.error("Missing parameters for writeCell: 'sheet', 'cell', 'value'");
        return Promise.reject(new Error('Missing parameters for writeCell'));
    }
    if (!isValidCellPattern(cell)) {
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
    for (const cellObj of cells) {
        const normalized = normalizeLegacyMessage(cellObj);
        const sheet = preferValue(normalized.sheet, normalized.sheetName) as string | undefined;
        const value = preferValue(normalized.value, normalized.data);
        if (!sheet || !normalized.cell || typeof value === 'undefined') {
            log.error("Missing parameters for writeCells: 'sheet', 'cell', 'value' in cells");
            return Promise.reject(new Error('Missing parameters for writeCells'));
        }
        if (!isValidCellPattern(normalized.cell)) {
            log.error(`Invalid cell pattern ${normalized.cell}. Expected: A1`);
            return Promise.reject(new Error(`Invalid cell pattern ${normalized.cell}. Expected: A1`));
        }
        normalized.sheet = sheet;
        normalized.value = value;
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
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const cell = messageData.cell;
    const alias = messageData.alias;
    if (!sheet || !cell) {
        log.error("Missing parameters for readCell: 'sheet', 'cell'");
        return Promise.reject(new Error('Missing parameters for readCell'));
    }
    if (!isValidCellPattern(cell)) {
        log.error(`Invalid cell pattern ${cell}. Expected: A1`);
        return Promise.reject(new Error(`Invalid cell pattern ${cell}. Expected: A1`));
    }
    return spreadsheet.readCell(sheet, cell, alias);
}

/**
 * Handles reading a range of spreadsheet cells.
 */
export function handleReadRange(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<any[][]> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const range = preferValue(messageData.range, messageData.cellRange) as string | undefined;
    const alias = messageData.alias;
    if (!sheet || !range) {
        log.error("Missing parameters for readRange: 'sheet', 'range'");
        return Promise.reject(new Error('Missing parameters for readRange'));
    }
    return spreadsheet.readRange(sheet, range, alias);
}

/**
 * Handles writing a rectangular cell range.
 */
export function handleWriteRange(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const range = preferValue(messageData.range, messageData.cellRange) as string | undefined;
    const values = preferValue(messageData.values, messageData.data);
    const alias = messageData.alias;
    if (!sheet || !range || typeof values === 'undefined') {
        log.error("Missing parameters for writeRange: 'sheet', 'range', 'values'");
        return Promise.reject(new Error('Missing parameters for writeRange'));
    }
    return spreadsheet.writeRange(sheet, range, values, alias);
}

/**
 * Handles clearing a rectangular cell range.
 */
export function handleClearRange(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const range = preferValue(messageData.range, messageData.cellRange) as string | undefined;
    const alias = messageData.alias;
    if (!sheet || !range) {
        log.error("Missing parameters for clearRange: 'sheet', 'range'");
        return Promise.reject(new Error('Missing parameters for clearRange'));
    }
    return spreadsheet.clearRange(sheet, range, alias);
}

/**
 * Handles setting the format for a range of cells.
 */
export function handleSetCellFormat(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = normalizeLegacyMessage(message.message as Record<string, any>);
    const sheet = preferValue(messageData.sheet, messageData.sheetName) as string | undefined;
    const range = preferValue(messageData.range, messageData.cellRange) as string | undefined;
    const format = messageData.format;
    const alias = messageData.alias;
    if (!sheet || !range || !format) {
        log.error("Missing parameters for setCellFormat: 'sheet', 'range', 'format'");
        return Promise.reject(new Error('Missing parameters for setCellFormat'));
    }
    return spreadsheet.setCellFormat(sheet, range, format, alias);
}
