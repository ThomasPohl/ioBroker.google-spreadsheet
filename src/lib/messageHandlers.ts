import type { SpreadsheetUtils } from './google';
import fs from 'fs';

/**
 * Handles appending data to a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName, data and optional alias
 * @returns Promise that resolves on success
 */
export function handleAppend(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (missingParameters(['sheetName', 'data'], messageData, log)) {
            reject(new Error('Missing parameters for append'));
        }
        spreadsheet
            .append(messageData.sheetName, messageData.data, messageData.alias)
            .then(() => resolve())
            .catch(error => reject(new Error(error)));
    });
}

/**
 * Handles deleting rows in a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName, start, end and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteRows(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (missingParameters(['sheetName', 'start', 'end'], messageData, log)) {
            reject(new Error('Missing parameters for deleteRows'));
        }
        spreadsheet
            .deleteRows(messageData.sheetName, messageData.start, messageData.end, messageData.alias)
            .then(() => resolve())
            .catch(error => reject(new Error(error)));
    });
}

/**
 * Handles creating a new spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName and optional alias
 * @returns Promise that resolves on success
 */
export function handleCreateSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (typeof message.message === 'string') {
        log.warn(
            'Deprecated call of createSheet with string as message. Please use object with sheetName and optional alias!',
        );
        return spreadsheet.createSheet(message.message, null);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['sheetName'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for createSheet'));
    }
    return spreadsheet.createSheet(messageData.sheetName as string, messageData.alias);
}

/**
 * Handles deleting a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteSheet(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (typeof message.message === 'string') {
        log.warn(
            'Deprecated call of deleteSheet with non-string as message. Please use object with sheetName and optional alias!',
        );
        return spreadsheet.deleteSheet(message.message);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['sheetName'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for deleteSheet'));
    }
    return spreadsheet.deleteSheet(messageData.sheetName as string, messageData.alias);
}

/**
 * Handles deleting multiple spreadsheet sheets.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetNames (array) and optional alias
 * @returns Promise that resolves on success
 */
export function handleDeleteSheets(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    if (Array.isArray(message.message)) {
        log.warn(
            'Deprecated call of deleteSheets with array as message. Please use object with sheetNames and optional alias!',
        );
        return spreadsheet.deleteSheets(message.message as string[], null);
    }
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['sheetNames'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for deleteSheets'));
    }
    return spreadsheet.deleteSheets(messageData.sheetNames as string[], messageData.alias);
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
    if (missingParameters(['source', 'target', 'index'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for duplicateSheet'));
    }
    return spreadsheet.duplicateSheet(messageData.source, messageData.target, messageData.index, messageData.alias);
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
    if (missingParameters(['target', 'parentFolder'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for upload'));
    }
    return spreadsheet.upload(messageData.target, messageData.parentFolder, fs.createReadStream(messageData.source));
}

/**
 * Handles writing to a single cell of a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName, cell, data and optional alias
 * @returns Promise that resolves on success
 */
export function handleWriteCell(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['sheetName', 'cell', 'data'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for writeCell'));
    }
    const cellPattern = new RegExp('[A-Z]+[0-9]+()');
    if (!cellPattern.test(messageData.cell)) {
        log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
        return Promise.reject(new Error(`Invalid cell pattern ${messageData.cell}. Expected: A1`));
    }
    return spreadsheet.writeCell(messageData.sheetName, messageData.cell, messageData.data, messageData.alias);
}

/**
 * Handles writing to multiple cells of one or more spreadsheet sheets.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with cells (array) and optional alias
 * @returns Promise that resolves on success
 */
export function handleWriteCells(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<void> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['cells'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for writeCells'));
    }
    const cells: Array<{ sheetName: string; cell: string; data: any }> = messageData.cells as Array<{
        sheetName: string;
        cell: string;
        data: any;
    }>;
    const cellPattern = new RegExp('[A-Z]+[0-9]+()');
    for (const cellObj of cells) {
        if (!cellPattern.test(cellObj.cell)) {
            log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
            return Promise.reject(new Error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`));
        }
    }
    return spreadsheet.writeCells(cells, messageData.alias);
}

/**
 * Handles reading a single cell of a spreadsheet sheet.
 *
 * @param spreadsheet Instance of SpreadsheetUtils
 * @param log ioBroker Logger
 * @param message Message object with sheetName, cell and optional alias
 * @returns Promise that resolves with the read value
 */
export function handleReadCell(
    spreadsheet: SpreadsheetUtils,
    log: ioBroker.Logger,
    message: Record<string, any>,
): Promise<any> {
    const messageData: Record<string, any> = message.message as Record<string, any>;
    if (missingParameters(['sheetName', 'cell'], messageData, log)) {
        return Promise.reject(new Error('Missing parameters for readCell'));
    }
    const cellPattern = new RegExp('[A-Z]+[0-9]+()');
    if (!cellPattern.test(messageData.cell)) {
        log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
        return Promise.reject(new Error(`Invalid cell pattern ${messageData.cell}. Expected: A1`));
    }
    return spreadsheet.readCell(messageData.sheetName, messageData.cell, messageData.alias);
}

function missingParameters(
    neededParameters: string[],
    messageData: Record<string, any>,
    log: ioBroker.Logger,
): boolean {
    let result = false;
    for (const parameter of neededParameters) {
        if (Object.keys(messageData).indexOf(parameter) == -1) {
            result = true;
            log.error(`The parameter '${parameter}' is required but was not passed!`);
        }
    }
    return result;
}
