
import { handleReadCells } from '../../../src/lib/messageHandlers/cellHandlers.ts';
import sinon from 'sinon';
import { expect } from 'chai';

describe('handleReadCells', () => {
    let spreadsheet: any;
    let log: any;

    beforeEach(() => {
        spreadsheet = {
            readCells: sinon.stub().resolves([[1, 2], [3, 4]]),
        };
        log = { error: sinon.stub(), warn: sinon.stub() };
    });

    it('should call readCells on spreadsheet and return values', async () => {
        const message = { message: { sheet: 'Tabelle1', range: 'A1:B2' } };
        const result = await handleReadCells(spreadsheet, log, message);
        sinon.assert.calledWith(spreadsheet.readCells, 'Tabelle1', 'A1:B2', undefined);
        expect(result).to.deep.equal([[1, 2], [3, 4]]);
    });

    it('should reject if parameters are missing', async () => {
        const message = { message: { sheet: 'Tabelle1' } };
        await expect(handleReadCells(spreadsheet, log, message)).to.be.rejected;
        sinon.assert.calledOnce(log.error);
    });

    it('should reject if range is invalid', async () => {
        const message = { message: { sheet: 'Tabelle1', range: 'foo' } };
        await expect(handleReadCells(spreadsheet, log, message)).to.be.rejected;
        sinon.assert.calledOnce(log.error);
    });
});
