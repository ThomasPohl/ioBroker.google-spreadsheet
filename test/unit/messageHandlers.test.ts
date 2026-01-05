import { expect } from 'chai';
import sinon from 'sinon';
import * as handlers from '../../src/lib/messageHandlers';

describe('messageHandlers', () => {
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
            upload: sinon.stub().resolves('uploadResult'),
            writeCell: sinon.stub().resolves('writeCellResult'),
            writeCells: sinon.stub().resolves('writeCellsResult'),
            readCell: sinon.stub().resolves('readCellResult'),
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        obj = { message: {}, from: 'test', callback: sinon.spy() };
    });

    it('handleAppend calls spreadsheet.append', async () => {
        obj.message = { sheetName: 'Sheet1', data: ['foo'], alias: 'main' };
        await handlers.handleAppend(spreadsheet, log, obj);
        expect(spreadsheet.append.calledWith('Sheet1', ['foo'], 'main')).to.be.true;
    });

    it('handleDeleteRows calls spreadsheet.deleteRows', async () => {
        obj.message = { sheetName: 'Sheet1', start: 1, end: 2, alias: 'main' };
        await handlers.handleDeleteRows(spreadsheet, log, obj);
        expect(spreadsheet.deleteRows.calledWith('Sheet1', 1, 2, 'main')).to.be.true;
    });

    it('handleCreateSheet calls spreadsheet.createSheet', async () => {
        obj.message = { sheetName: 'Sheet1', alias: 'main' };
        const result = await handlers.handleCreateSheet(spreadsheet, log, obj);
        expect(spreadsheet.createSheet.calledWith('Sheet1', 'main')).to.be.true;
        expect(result).to.equal('createSheetResult');
    });

    it('handleDeleteSheet calls spreadsheet.deleteSheet', async () => {
        obj.message = { sheetName: 'Sheet1', alias: 'main' };
        const result = await handlers.handleDeleteSheet(spreadsheet, log, obj);
        expect(spreadsheet.deleteSheet.calledWith('Sheet1', 'main')).to.be.true;
        expect(result).to.equal('deleteSheetResult');
    });

    it('handleDeleteSheets calls spreadsheet.deleteSheets', async () => {
        obj.message = { sheetNames: ['Sheet1', 'Sheet2'], alias: 'main' };
        const result = await handlers.handleDeleteSheets(spreadsheet, log, obj);
        expect(spreadsheet.deleteSheets.calledWith(['Sheet1', 'Sheet2'], 'main')).to.be.true;
        expect(result).to.equal('deleteSheetsResult');
    });

    it('handleDuplicateSheet calls spreadsheet.duplicateSheet', async () => {
        obj.message = { source: 'Sheet1', target: 'Copy', index: 1, alias: 'main' };
        const result = await handlers.handleDuplicateSheet(spreadsheet, log, obj);
        expect(spreadsheet.duplicateSheet.calledWith('Sheet1', 'Copy', 1, 'main')).to.be.true;
        expect(result).to.equal('duplicateSheetResult');
    });

    it('handleUpload calls spreadsheet.upload', async () => {
        obj.message = { target: 'targetFile', parentFolder: 'parent', source: 'sourceFile' };
        // fs.createReadStream wird im Handler verwendet, daher mocken
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        const streamStub = {};
        sinon.stub(fs, 'createReadStream').returns(streamStub);
        spreadsheet.upload = sinon.stub().resolves('uploadResult');
        const result = await handlers.handleUpload(spreadsheet, log, obj);
        expect(spreadsheet.upload.calledWith('targetFile', 'parent', streamStub)).to.be.true;
        expect(result).to.equal('uploadResult');
        fs.createReadStream.restore();
    });

    it('handleWriteCell calls spreadsheet.writeCell', async () => {
        obj.message = { sheetName: 'Sheet1', cell: 'A1', data: 'foo', alias: 'main' };
        const result = await handlers.handleWriteCell(spreadsheet, log, obj);
        expect(spreadsheet.writeCell.calledWith('Sheet1', 'A1', 'foo', 'main')).to.be.true;
        expect(result).to.equal('writeCellResult');
    });

    it('handleWriteCells calls spreadsheet.writeCells', async () => {
        obj.message = {
            cells: [
                { sheetName: 'Sheet1', cell: 'A1', data: 1 },
                { sheetName: 'Sheet1', cell: 'A2', data: 2 },
            ],
            alias: 'main',
        };
        const result = await handlers.handleWriteCells(spreadsheet, log, obj);
        expect(spreadsheet.writeCells.calledWith(obj.message.cells, 'main')).to.be.true;
        expect(result).to.equal('writeCellsResult');
    });

    it('handleReadCell calls spreadsheet.readCell', async () => {
        obj.message = { sheetName: 'Sheet1', cell: 'A1', alias: 'main' };
        const result = await handlers.handleReadCell(spreadsheet, log, obj);
        expect(spreadsheet.readCell.calledWith('Sheet1', 'A1', 'main')).to.be.true;
        expect(result).to.equal('readCellResult');
    });
});
