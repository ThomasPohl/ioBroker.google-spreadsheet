import type { SpreadsheetUtils } from '../google';
import fs from 'fs';

/**
 * Handles uploading a file to a Google Drive folder.
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
