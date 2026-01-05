import * as utils from '@iobroker/adapter-core';

import { SpreadsheetUtils } from './lib/google';
import {
    handleAppend,
    handleDeleteRows,
    handleCreateSheet,
    handleDeleteSheet,
    handleDeleteSheets,
    handleDuplicateSheet,
    handleUpload,
    handleWriteCell,
    handleWriteCells,
    handleReadCell,
} from './lib/messageHandlers';

/**
 * The adapter class
 */
export class GoogleSpreadsheet extends utils.Adapter {
    private spreadsheet: SpreadsheetUtils;

    /**
     * Creates an instance of the adapter class.
     *
     * @param options The adapter options
     */
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
                    this.extendForeignObject(`system.adapter.${this.name}.${this.instance}`, data)
                        .then(() => {
                            this.log.info('privateKey is stored now encrypted');
                        })
                        .catch(err => {
                            this.log.error(`Cannot store encrypted privateKey: ${err}`);
                        });
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

    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.messagebox" property to be set to true in io-package.json
     *
     * @param obj The message object
     */
    private onMessage(obj: ioBroker.Message): void {
        const handlers = {
            append: { handler: handleAppend, logMessage: 'append to spreadsheet' },
            deleteRows: { handler: handleDeleteRows, logMessage: 'delete rows from spreadsheet' },
            createSheet: { handler: handleCreateSheet, logMessage: 'create sheet' },
            deleteSheet: { handler: handleDeleteSheet, logMessage: 'delete sheet' },
            deleteSheets: { handler: handleDeleteSheets, logMessage: 'delete sheets' },
            duplicateSheet: { handler: handleDuplicateSheet, logMessage: 'duplicate sheet' },
            upload: { handler: handleUpload, logMessage: 'upload file' },
            writeCell: { handler: handleWriteCell, logMessage: 'write cell' },
            writeCells: { handler: handleWriteCells, logMessage: 'write cells' },
            readCell: { handler: handleReadCell, logMessage: 'read cell' },
        };

        this.log.debug(`Received message: ${JSON.stringify(obj)}`);
        if (typeof obj === 'object' && obj.message) {
            if (obj.command && obj.command in handlers) {
                const command = obj.command as keyof typeof handlers;
                this.log.debug(handlers[command].logMessage);
                handlers[command]
                    .handler(this.spreadsheet, this.log, obj)
                    .then((result: any) => {
                        if (obj.callback) {
                            this.sendTo(obj.from, obj.command, result ? result : 'Message received', obj.callback);
                        }
                    })
                    .catch((error: Error) => {
                        this.log.error(`Cannot ${obj.command}: ${error}`);
                    });
            } else {
                this.log.warn(`unknown command: ${obj.command}`);
            }
        }
    }
}
