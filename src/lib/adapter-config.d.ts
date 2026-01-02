// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface Spreadsheet {
            spreadsheetId: string;
            alias: string;
            isDefault?: boolean;
        }
        interface AdapterConfig {
            //deprecated - use 'spreadsheets' instead
            spreadsheetId: string;
            serviceAccountEmail: string;
            privateKey: string;
            spreadsheets: Spreadsheet[];
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export type Spreadsheet = ioBroker.Spreadsheet;
export type AdapterConfig = ioBroker.AdapterConfig;
export {};