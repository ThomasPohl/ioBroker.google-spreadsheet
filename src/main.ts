/*
 * Created with @iobroker/create-adapter v2.4.0
 */

import * as utils from '@iobroker/adapter-core';

import fs from 'fs';
import { SpreadsheetUtils } from './lib/google';

class GoogleSpreadsheet extends utils.Adapter {
    private spreadsheet: SpreadsheetUtils;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'google-spreadsheet',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.spreadsheet = new SpreadsheetUtils(this.config, this.log);
    }

    private migrateSpreadhseetIdToTableIfNeeded(): void {
        if (
            this.config.spreadsheetId &&
            this.config.spreadsheetId.length > 0 &&
            (!this.config.spreadsheets || this.config.spreadsheets.length === 0)
        ) {
            this.log.info(`Migrating spreadsheetId ${this.config.spreadsheetId} to spreadsheets table`);
            this.config.spreadsheets = [
                {
                    spreadsheetId: this.config.spreadsheetId,
                    alias: 'default',
                    isDefault: true,
                },
            ];
            this.config.spreadsheetId = '';
            this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, { native: this.config }, () => {
                this.log.info('Migration completed');
            });
        }
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here
        this.migrateSpreadhseetIdToTableIfNeeded();

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.debug(`config spreadsheetId: ${this.config.spreadsheetId}`);
        if (this.config.privateKey && this.config.serviceAccountEmail && this.config.spreadsheets.length > 0) {
            await this.setState('info.connection', true, true);
            this.log.info('Google-spreadsheet adapter configured');
        } else {
            await this.setState('info.connection', false, true);
            this.log.warn('Google-spreadsheet adapter not configured');
        }
        await this.encryptPrivateKeyIfNeeded();

        this.spreadsheet = new SpreadsheetUtils(this.config, this.log);
    }

    private async encryptPrivateKeyIfNeeded(): Promise<void> {
        if (this.config.privateKey && this.config.privateKey.length > 0) {
            await this.getForeignObjectAsync(`system.adapter.${this.name}.${this.instance}`).then(data => {
                if (data && data.native && data.native.privateKey && !data.native.privateKey.startsWith('$/aes')) {
                    this.config.privateKey = data.native.privateKey;
                    data.native.privateKey = this.encrypt(data.native.privateKey);
                    this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, data);
                    this.log.info('privateKey is stored now encrypted');
                }
            });
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback Callback so the adapter can shut down
     */
    private onUnload(callback: () => void): void {
        try {
            callback();
        } catch (e) {
            this.log.error(`Error during unload: ${JSON.stringify(e)}`);
            callback();
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    private onMessage(obj: ioBroker.Message): void {
        if (typeof obj === 'object' && obj.message) {
            switch (obj.command) {
                case 'append': {
                    this.log.debug('append to spreadsheet');
                    this.append(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'deleteRows': {
                    this.log.debug('delete rows from spreadsheet');
                    this.deleteRows(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'createSheet': {
                    this.log.debug('create sheet');
                    this.createSheet(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'deleteSheet': {
                    this.log.debug('delete sheet');
                    this.deleteSheet(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'deleteSheets': {
                    this.log.debug('delete sheet');
                    this.deleteSheets(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'duplicateSheet': {
                    this.log.debug('duplicate sheet');
                    this.duplicateSheet(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'upload': {
                    this.log.debug('upload file');
                    this.upload(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'writeCell': {
                    this.log.debug('write data to single cell');
                    this.writeCell(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'writeCells': {
                    this.log.debug('write data to multiple cells');
                    this.writeCells(obj);

                    if (obj.callback) {
                        this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                    }
                    break;
                }
                case 'readCell': {
                    this.log.debug('read single cell');
                    this.readCell(obj)
                        .then((result: any) => {
                            if (obj.callback) {
                                this.sendTo(obj.from, obj.command, result, obj.callback);
                            }
                        })
                        .catch(error => this.log.error(`Cannot read cell: ${error}`));

                    break;
                }
                default: {
                    this.log.warn(`unknown command: ${obj.command}`);
                    break;
                }
            }
        }
    }

    private upload(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['target', 'parentFolder'], messageData)) {
            return;
        }
        this.spreadsheet.upload(messageData.target, messageData.parentFolder, fs.createReadStream(messageData.source));
    }
    private append(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['sheetName', 'data'], messageData)) {
            return;
        }
        this.spreadsheet.append(messageData.sheetName, messageData.data, messageData.sheetAlias);
    }
    private writeCell(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['sheetName', 'cell', 'data'], messageData)) {
            return;
        }
        //Check that cell is a valid pattern
        const cellPattern = new RegExp('[A-Z]+[0-9]+()');
        if (!cellPattern.test(messageData.cell)) {
            this.log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
            return;
        }
        this.spreadsheet.writeCell(messageData.sheetName, messageData.cell, messageData.data);
    }
    private writeCells(message: Record<string, any>): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['cells'], messageData)) {
            return;
        }
        const cells: Array<{ sheetName: string; cell: string; data: any }> = messageData.cells as Array<{
            sheetName: string;
            cell: string;
            data: any;
        }>;
        //Check that cell is a valid pattern
        const cellPattern = new RegExp('[A-Z]+[0-9]+()');
        for (const cellObj of cells) {
            if (!cellPattern.test(cellObj.cell)) {
                this.log.error(`Invalid cell pattern ${cellObj.cell}. Expected: A1`);
                return;
            }
        }
        this.spreadsheet.writeCells(cells);
    }
    private async readCell(message: Record<string, any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const messageData: Record<string, any> = message.message as Record<string, any>;
            if (this.missingParameters(['sheetName', 'cell'], messageData)) {
                return;
            }
            //Check that cell is a valid pattern
            const cellPattern = new RegExp('[A-Z]+[0-9]+()');
            if (!cellPattern.test(messageData.cell)) {
                this.log.error(`Invalid cell pattern ${messageData.cell}. Expected: A1`);
                return;
            }
            this.spreadsheet
                .readCell(messageData.sheetName, messageData.cell)
                .then(result => resolve(result))
                .catch(error => reject(new Error(error)));
        });
    }
    public deleteRows(message: ioBroker.Message): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['sheetName', 'start', 'end'], messageData)) {
            return;
        }
        this.spreadsheet.deleteRows(messageData.sheetName, messageData.start, messageData.end);
    }
    public createSheet(message: ioBroker.Message): void {
        this.spreadsheet.createSheet(message.message as string);
    }
    public deleteSheet(message: ioBroker.Message): void {
        this.spreadsheet.deleteSheet(message.message as string);
    }
    public deleteSheets(message: ioBroker.Message): void {
        this.spreadsheet.deleteSheets(message.message as string[]);
    }
    public duplicateSheet(message: ioBroker.Message): void {
        const messageData: Record<string, any> = message.message as Record<string, any>;
        if (this.missingParameters(['source', 'target', 'index'], messageData)) {
            return;
        }
        this.spreadsheet.duplicateSheet(messageData.source, messageData.target, messageData.index);
    }

    private missingParameters(neededParameters: string[], messageData: Record<string, any>): boolean {
        let result = false;
        for (const parameter of neededParameters) {
            if (Object.keys(messageData).indexOf(parameter) == -1) {
                result = true;
                this.log.error(`The parameter '${parameter}' is required but was not passed!`);
            }
        }

        return result;
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new GoogleSpreadsheet(options);
} else {
    // otherwise start the instance directly
    (() => new GoogleSpreadsheet())();
}
