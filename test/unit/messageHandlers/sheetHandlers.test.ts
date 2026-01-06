import { expect } from 'chai';
import sinon from 'sinon';
import {
    handleAppend,
    handleDeleteRows,
    handleCreateSheet,
    handleDeleteSheet,
    handleDeleteSheets,
    handleDuplicateSheet,
} from '../../../src/lib/messageHandlers/sheetHandlers';

describe('sheetHandlers', () => {
    let spreadsheet: any;
    let log: any;
    let obj: any;

    beforeEach(() => {
        spreadsheet = {
            append: sinon.stub().resolves('appendResult'),
            deleteRows: sinon.stub().resolves('deleteRowsResult'),
            createSheet: sinon.stub().resolves('createSheetResult'),
            deleteSheet: sinon.stub().resolves('deleteSheetResult'),
            deleteSheets: sinon.stub().resolves('deleteSheetsResult'),
            duplicateSheet: sinon.stub().resolves('duplicateSheetResult'),
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        obj = { message: {}, from: 'test', callback: sinon.spy() };
    });

    it('handleAppend calls spreadsheet.append', async () => {
        obj.message = { sheetName: 'Sheet1', data: ['foo'], alias: 'main' };
        await handleAppend(spreadsheet, log, obj);
        expect(spreadsheet.append.calledWith('Sheet1', ['foo'], 'main')).to.be.true;
    });

    it('handleDeleteRows calls spreadsheet.deleteRows', async () => {
        obj.message = { sheetName: 'Sheet1', start: 1, end: 2, alias: 'main' };
        await handleDeleteRows(spreadsheet, log, obj);
        expect(spreadsheet.deleteRows.calledWith('Sheet1', 1, 2, 'main')).to.be.true;
    });

    it('handleCreateSheet calls spreadsheet.createSheet', async () => {
        obj.message = { sheetName: 'Sheet1', alias: 'main' };
        const result = await handleCreateSheet(spreadsheet, log, obj);
        expect(spreadsheet.createSheet.calledWith('Sheet1', 'main')).to.be.true;
        expect(result).to.equal('createSheetResult');
    });

    it('handleDeleteSheet calls spreadsheet.deleteSheet', async () => {
        obj.message = { sheetName: 'Sheet1', alias: 'main' };
        const result = await handleDeleteSheet(spreadsheet, log, obj);
        expect(spreadsheet.deleteSheet.calledWith('Sheet1', 'main')).to.be.true;
        expect(result).to.equal('deleteSheetResult');
    });

    it('handleDeleteSheets calls spreadsheet.deleteSheets', async () => {
        obj.message = { sheetNames: ['Sheet1', 'Sheet2'], alias: 'main' };
        const result = await handleDeleteSheets(spreadsheet, log, obj);
        expect(spreadsheet.deleteSheets.calledWith(['Sheet1', 'Sheet2'], 'main')).to.be.true;
        expect(result).to.equal('deleteSheetsResult');
    });

    it('handleDuplicateSheet calls spreadsheet.duplicateSheet', async () => {
        obj.message = { source: 'Sheet1', target: 'Copy', index: 1, alias: 'main' };
        const result = await handleDuplicateSheet(spreadsheet, log, obj);
        expect(spreadsheet.duplicateSheet.calledWith('Sheet1', 'Copy', 1, 'main')).to.be.true;
        expect(result).to.equal('duplicateSheetResult');
    });
});
