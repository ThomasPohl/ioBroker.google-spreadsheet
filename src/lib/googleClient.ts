import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

export class GoogleClient {
    private sheetsClient: sheets_v4.Sheets | null = null;
    private driveClient: any = null;

    public constructor(
        private readonly config: ioBroker.AdapterConfig,
        private readonly log: ioBroker.Log,
    ) {}

    public getSheetsClient(): sheets_v4.Sheets {
        if (!this.sheetsClient) {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: this.config.serviceAccountEmail,
                    private_key: this.formatPrivateKey(this.config.privateKey),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            this.sheetsClient = google.sheets({ version: 'v4', auth });
        }
        return this.sheetsClient;
    }

    public getDriveClient(): any {
        if (!this.driveClient) {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: this.config.serviceAccountEmail,
                    private_key: this.formatPrivateKey(this.config.privateKey),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            this.driveClient = google.drive({ version: 'v3', auth });
        }
        return this.driveClient;
    }

    public getSpreadsheetId(sheetAlias: string | null): string {
        if (sheetAlias) {
            const sheet = this.config.spreadsheets?.find(s => s.alias === sheetAlias);
            if (sheet) {
                return sheet.spreadsheetId;
            }
            this.log.warn(`No spreadsheet found for alias ${sheetAlias}, using default spreadsheetId`);
        }

        const defaultSheet = this.config.spreadsheets?.find(s => s.isDefault);
        if (defaultSheet) {
            return defaultSheet.spreadsheetId;
        }

        throw new Error('No default spreadsheetId found in configuration');
    }

    public formatPrivateKey(privateKey: string): string | undefined {
        if (privateKey) {
            return privateKey.replace(/\\n/g, '\n');
        }
        return undefined;
    }
}
