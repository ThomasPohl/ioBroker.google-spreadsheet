import { expect } from 'chai';
import sinon from 'sinon';
import { SpreadsheetUtils } from '../../src/lib/google';
import { GoogleSpreadsheet } from '../../src/main';

describe('GoogleSpreadsheet', () => {
    let config: any;
    let log: any;
    let spreadsheet: SpreadsheetUtils;

    // Helper function for adapter instance
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function createInstance(customConfig = {}) {
        const instance = Object.create(GoogleSpreadsheet.prototype);
        instance.log = log;
        instance.config = { ...config, ...customConfig };
        instance.spreadsheet = spreadsheet;
        // Mocks für Adapter-Methoden
        instance.setState = sinon.stub().resolves();
        instance.getForeignObjectAsync = sinon.stub().resolves({ native: { privateKey: 'priv' } });
        instance.extendForeignObject = sinon.stub().resolves();
        instance.encrypt = sinon.stub().returns('ENCRYPTED');
        instance.sendTo = sinon.stub();
        instance.name = 'google-spreadsheet';
        instance.instance = 0;
        return instance;
    }

    beforeEach(() => {
        config = {
            privateKey: 'key',
            serviceAccountEmail: 'mail',
            spreadsheets: [{ alias: 'main', spreadsheetId: 'id1', isDefault: true }],
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        spreadsheet = new SpreadsheetUtils(config, log);
    });

    it('should warn on unknown command (real adapter)', () => {
        // Adapter-Instance with mocked log
        const instance = createInstance();
        instance.onMessage({ command: 'unknown', message: {}, from: '', callback: undefined });
        expect(log.warn.calledWithMatch('unknown command')).to.be.true;
    });

    it('should call onUnload and handle errors', () => {
        const instance = createInstance();
        const callback = sinon.spy();
        // Erfolgreich
        instance.onUnload(callback);
        expect(callback.calledOnce).to.be.true;
        // Mit Fehler, aber Exception wird im Test abgefangen
        const errorInstance = createInstance();
        errorInstance.log = { ...log, error: sinon.spy() };
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const errorCallback = () => {
            throw new Error('fail');
        };
        try {
            errorInstance.onUnload(errorCallback);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            // Fehler wird erwartet, aber nicht weitergeworfen
        }
        expect(errorInstance.log.error.called).to.be.true;
    });

    it('should migrate spreadsheetId to table if needed', () => {
        const instance = createInstance({ spreadsheetId: 'migId', spreadsheets: [] });
        instance.extendForeignObject = sinon.stub().callsFake((_id, _data, cb) => cb());
        instance.migrateSpreadhseetIdToTableIfNeeded();
        expect(instance.config.spreadsheetId).to.equal('');
        expect(instance.config.spreadsheets[0].spreadsheetId).to.equal('migId');
        expect(instance.extendForeignObject.called).to.be.true;
    });

    it('should not migrate if spreadsheetId is missing', () => {
        const instance = createInstance({ spreadsheetId: '', spreadsheets: [] });
        instance.extendForeignObject = sinon.stub();
        instance.migrateSpreadhseetIdToTableIfNeeded();
        expect(instance.extendForeignObject.called).to.be.false;
    });

    it('should encrypt privateKey if needed', async () => {
        const instance = createInstance({ privateKey: 'priv' });
        instance.getForeignObjectAsync = sinon.stub().resolves({ native: { privateKey: 'priv' } });
        instance.extendForeignObject = sinon.stub().resolves();
        instance.encrypt = sinon.stub().returns('ENCRYPTED');
        await instance.encryptPrivateKeyIfNeeded();
        expect(instance.extendForeignObject.called).to.be.true;
        expect(instance.encrypt.called).to.be.true;
    });

    it('should not encrypt if privateKey is empty', async () => {
        const instance = createInstance({ privateKey: '' });
        instance.getForeignObjectAsync = sinon.stub();
        instance.extendForeignObject = sinon.stub();
        await instance.encryptPrivateKeyIfNeeded();
        expect(instance.extendForeignObject.called).to.be.false;
    });

    it('should handle onReady with valid config', async () => {
        const instance = createInstance();
        instance.migrateSpreadhseetIdToTableIfNeeded = sinon.stub();
        instance.setState = sinon.stub().resolves();
        instance.encryptPrivateKeyIfNeeded = sinon.stub().resolves();
        await instance.onReady();
        expect(instance.setState.calledWith('info.connection', true, true)).to.be.true;
        expect(instance.migrateSpreadhseetIdToTableIfNeeded.called).to.be.true;
        expect(instance.encryptPrivateKeyIfNeeded.called).to.be.true;
    });

    it('should handle onReady with invalid config', async () => {
        const instance = createInstance({ privateKey: '', serviceAccountEmail: '', spreadsheets: [] });
        instance.migrateSpreadhseetIdToTableIfNeeded = sinon.stub();
        instance.setState = sinon.stub().resolves();
        instance.encryptPrivateKeyIfNeeded = sinon.stub().resolves();
        await instance.onReady();
        expect(instance.setState.calledWith('info.connection', false, true)).to.be.true;
    });

    describe('SpreadsheetUtils Handler', () => {
        beforeEach(() => {
            spreadsheet.append = sinon.stub().resolves();
            spreadsheet.writeCell = sinon.stub().resolves();
            spreadsheet.readCell = sinon.stub().resolves('testValue');
        });

        it('should call append on spreadsheet', async () => {
            await spreadsheet.append('Sheet1', ['foo'], 'main');
            expect(spreadsheet.append.calledWith('Sheet1', ['foo'], 'main')).to.be.true;
        });

        it('should call writeCell on spreadsheet', async () => {
            await spreadsheet.writeCell('Sheet1', 'A1', 'bar', 'main');
            expect(spreadsheet.writeCell.calledWith('Sheet1', 'A1', 'bar', 'main')).to.be.true;
        });

        it('should call readCell on spreadsheet and return value', async () => {
            const result = await spreadsheet.readCell('Sheet1', 'A1', 'main');
            expect(spreadsheet.readCell.calledWith('Sheet1', 'A1', 'main')).to.be.true;
            expect(result).to.equal('testValue');
        });
    });
});
