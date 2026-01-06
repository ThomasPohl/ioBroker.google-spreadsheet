import { expect } from 'chai';
import sinon from 'sinon';
import { handleWriteCell, handleWriteCells, handleReadCell } from '../../../src/lib/messageHandlers/cellHandlers';

describe('cellHandlers', () => {
    let spreadsheet: any;
    let log: any;
    let obj: any;

    beforeEach(() => {
        spreadsheet = {
            writeCell: sinon.stub().resolves('writeCellResult'),
            writeCells: sinon.stub().resolves('writeCellsResult'),
            readCell: sinon.stub().resolves('readCellResult'),
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        obj = { message: {}, from: 'test', callback: sinon.spy() };
    });

    it('handleWriteCell calls spreadsheet.writeCell', async () => {
        obj.message = { sheetName: 'Sheet1', cell: 'A1', data: 'foo', alias: 'main' };
        const result = await handleWriteCell(spreadsheet, log, obj);
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
        const result = await handleWriteCells(spreadsheet, log, obj);
        expect(spreadsheet.writeCells.calledWith(obj.message.cells, 'main')).to.be.true;
        expect(result).to.equal('writeCellsResult');
    });

    it('handleReadCell calls spreadsheet.readCell', async () => {
        obj.message = { sheetName: 'Sheet1', cell: 'A1', alias: 'main' };
        const result = await handleReadCell(spreadsheet, log, obj);
        expect(spreadsheet.readCell.calledWith('Sheet1', 'A1', 'main')).to.be.true;
        expect(result).to.equal('readCellResult');
    });
});
