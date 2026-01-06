import { expect } from 'chai';
import sinon from 'sinon';
import { handleUpload } from '../../../src/lib/messageHandlers/uploadHandlers';

describe('uploadHandlers', () => {
    let spreadsheet: any;
    let log: any;
    let obj: any;

    beforeEach(() => {
        spreadsheet = {
            upload: sinon.stub().resolves('uploadResult'),
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        obj = { message: {}, from: 'test', callback: sinon.spy() };
    });

    it('handleUpload calls spreadsheet.upload', async () => {
        obj.message = { target: 'targetFile', parentFolder: 'parent', source: 'sourceFile' };
        // fs.createReadStream wird im Handler verwendet, daher mocken
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        const streamStub = {};
        sinon.stub(fs, 'createReadStream').returns(streamStub);
        spreadsheet.upload = sinon.stub().resolves('uploadResult');
        const result = await handleUpload(spreadsheet, log, obj);
        expect(spreadsheet.upload.calledWith('targetFile', 'parent', streamStub)).to.be.true;
        expect(result).to.equal('uploadResult');
        fs.createReadStream.restore();
    });
});
