import { expect } from 'chai';
import sinon from 'sinon';
import {
    handleWriteCell,
    handleWriteCells,
    handleReadCell,
    handleReadRange,
    handleWriteRange,
    handleClearRange,
    handleSetCellFormat,
} from '../../../src/lib/messageHandlers/cellHandlers';

describe('cellHandlers', () => {
    let spreadsheet: any;
    let log: any;
    let obj: any;

    beforeEach(() => {
        spreadsheet = {
            writeCell: sinon.stub().resolves('writeCellResult'),
            writeCells: sinon.stub().resolves('writeCellsResult'),
            readCell: sinon.stub().resolves('readCellResult'),
            readRange: sinon.stub().resolves([['a', 'b']]),
            writeRange: sinon.stub().resolves('writeRangeResult'),
            clearRange: sinon.stub().resolves('clearRangeResult'),
            setCellFormat: sinon.stub().resolves('setCellFormatResult'),
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

    it('handleReadRange calls spreadsheet.readRange', async () => {
        obj.message = { sheet: 'Sheet1', range: 'A1:B2', alias: 'main' };
        const result = await handleReadRange(spreadsheet, log, obj);
        expect(spreadsheet.readRange.calledWith('Sheet1', 'A1:B2', 'main')).to.be.true;
        expect(result).to.deep.equal([['a', 'b']]);
    });

    it('handleWriteRange calls spreadsheet.writeRange', async () => {
        obj.message = { sheet: 'Sheet1', range: 'A1:B2', values: [['a', 'b'], ['c', 'd']], alias: 'main' };
        const result = await handleWriteRange(spreadsheet, log, obj);
        expect(spreadsheet.writeRange.calledWith('Sheet1', 'A1:B2', [['a', 'b'], ['c', 'd']], 'main')).to.be.true;
        expect(result).to.equal('writeRangeResult');
    });

    it('handleClearRange calls spreadsheet.clearRange', async () => {
        obj.message = { sheet: 'Sheet1', range: 'A1:B2', alias: 'main' };
        const result = await handleClearRange(spreadsheet, log, obj);
        expect(spreadsheet.clearRange.calledWith('Sheet1', 'A1:B2', 'main')).to.be.true;
        expect(result).to.equal('clearRangeResult');
    });

    it('handleSetCellFormat calls spreadsheet.setCellFormat', async () => {
        obj.message = {
            sheet: 'Sheet1',
            range: 'A1:B2',
            format: { backgroundColor: { red: 1, green: 0, blue: 0 }, bold: true },
            alias: 'main',
        };
        const result = await handleSetCellFormat(spreadsheet, log, obj);
        expect(spreadsheet.setCellFormat.calledWith('Sheet1', 'A1:B2', obj.message.format, 'main')).to.be.true;
        expect(result).to.equal('setCellFormatResult');
    });
});
