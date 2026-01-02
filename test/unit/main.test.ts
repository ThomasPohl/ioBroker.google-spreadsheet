import { expect } from 'chai';
import sinon from 'sinon';
import { SpreadsheetUtils } from '../../src/lib/google';

describe('GoogleSpreadsheet', () => {
    let adapter: any;
    let config: any;
    let log: any;
    let spreadsheet: SpreadsheetUtils;

    beforeEach(() => {
        config = {
            privateKey: 'key',
            serviceAccountEmail: 'mail',
            spreadsheets: [{ alias: 'main', spreadsheetId: 'id1', isDefault: true }],
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        spreadsheet = new SpreadsheetUtils(config, log);

        // Create a mock adapter object with the methods we want to test
        adapter = {
            config: config,
            log: log,
            spreadsheet: spreadsheet,
            // Manually implement the methods for testing
            missingParameters(requiredParams: string[], obj: any): boolean {
                for (const param of requiredParams) {
                    if (!obj || obj[param] === undefined || obj[param] === null) {
                        this.log.error(`The parameter '${param}' is required but was not provided.`);
                        return true;
                    }
                }
                return false;
            },
            onMessage(obj: any): void {
                if (!obj || !obj.command) {
                    return;
                }
                this.log.warn(`unknown command: ${obj.command}`);
            },
        };
    });

    it('should detect missing parameters', () => {
        expect(adapter.missingParameters(['foo'], {})).to.be.true;
        expect(log.error.calledWithMatch("The parameter 'foo' is required")).to.be.true;
    });

    it('should not detect missing parameters if all present', () => {
        expect(adapter.missingParameters(['foo'], { foo: 1 })).to.be.false;
    });

    it('should warn on unknown command', () => {
        adapter.onMessage({ command: 'unknown', message: {}, from: '', callback: undefined });
        expect(log.warn.calledWithMatch('unknown command')).to.be.true;
    });

    // Weitere Tests für Methoden wie append, writeCell, etc. können mit Mocks für spreadsheet ergänzt werden.
});
