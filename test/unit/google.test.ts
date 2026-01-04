import { expect } from 'chai';
import sinon from 'sinon';
import { SpreadsheetUtils } from '../../src/lib/google';

describe('SpreadsheetUtils', () => {
    let config: any;
    let log: any;
    let utils: SpreadsheetUtils;

    beforeEach(() => {
        config = {
            serviceAccountEmail: 'test@example.com',
            privateKey: 'fake-key',
            spreadsheets: [
                { alias: 'main', spreadsheetId: 'id1', isDefault: true },
                { alias: 'other', spreadsheetId: 'id2', isDefault: false },
            ],
        };
        log = { debug: sinon.spy(), error: sinon.spy(), warn: sinon.spy(), info: sinon.spy() };
        utils = new SpreadsheetUtils(config, log);
    });

    it('getSpreadsheetId returns correct id for alias', () => {
        expect(utils.getSpreadsheetId('main')).to.equal('id1');
        expect(utils.getSpreadsheetId('other')).to.equal('id2');
    });

    it('getSpreadsheetId returns default if alias not found', () => {
        expect(utils.getSpreadsheetId(null)).to.equal('id1');
        expect(utils.getSpreadsheetId(undefined as any)).to.equal('id1');
    });

    it('getSpreadsheetId throws if no default', () => {
        config.spreadsheets[0].isDefault = false;
        expect(() => utils.getSpreadsheetId(null)).to.throw();
    });

    it('prepareValues wraps non-array', () => {
        expect(utils['prepareValues']('foo')).to.deep.equal([['foo']]);
    });

    it('prepareValues wraps array', () => {
        expect(utils['prepareValues']([1, 2])).to.deep.equal([[1, 2]]);
    });

    it('formatPrivateKey replaces \\n', () => {
        expect(utils['formatPrivateKey']('a\\nb')).to.equal('a\nb');
    });

    it('formatPrivateKey returns undefined for empty', () => {
        expect(utils['formatPrivateKey']('')).to.be.undefined;
    });

    describe('API operations with mocked googleapis', () => {
        let sheetsStub: any;
        let initStub: sinon.SinonStub;

        beforeEach(() => {
            // Mock für die Google Sheets API
            sheetsStub = {
                spreadsheets: {
                    values: {
                        append: sinon.stub().resolves({}),
                        get: sinon.stub().resolves({ data: { values: [['test']] } }),
                        batchUpdate: sinon.stub().resolves({}),
                    },
                    get: sinon.stub().resolves({
                        data: {
                            sheets: [
                                { properties: { sheetId: 123, title: 'Sheet1' } },
                                { properties: { sheetId: 456, title: 'Sheet2' } },
                            ],
                        },
                    }),
                    batchUpdate: sinon.stub().resolves({}),
                },
            };
            initStub = sinon.stub(utils, 'init' as any).returns(sheetsStub);
        });

        afterEach(() => {
            initStub.restore();
        });

        describe('append', () => {
            it('should call API with correct parameters', async () => {
                await utils.append('Sheet1', ['data1', 'data2'], 'main');

                expect(sheetsStub.spreadsheets.values.append.calledOnce).to.be.true;
                const args = sheetsStub.spreadsheets.values.append.firstCall.args[0];
                expect(args.range).to.equal('Sheet1');
                expect(args.spreadsheetId).to.equal('id1');
                expect(args.valueInputOption).to.equal('USER_ENTERED');
                expect(args.requestBody.values).to.deep.equal([['data1', 'data2']]);
            });

            it('should use default spreadsheet when alias is null', async () => {
                await utils.append('Sheet1', ['data'], null);

                const args = sheetsStub.spreadsheets.values.append.firstCall.args[0];
                expect(args.spreadsheetId).to.equal('id1');
            });
        });

        describe('deleteRows', () => {
            it('should delete rows with correct parameters', async () => {
                await utils.deleteRows('Sheet1', 2, 5, 'main');

                expect(sheetsStub.spreadsheets.get.calledOnce).to.be.true;
            });
        });

        describe('createSheet', () => {
            it('should create sheet with title', async () => {
                await utils.createSheet('NewSheet', 'main');

                expect(sheetsStub.spreadsheets.batchUpdate.calledOnce).to.be.true;
                const args = sheetsStub.spreadsheets.batchUpdate.firstCall.args[0];
                expect(args.requestBody.requests[0].addSheet.properties.title).to.equal('NewSheet');
            });
        });

        describe('deleteSheet', () => {
            it('should delete sheet by title', async () => {
                await utils.deleteSheet('Sheet1', 'main');

                expect(sheetsStub.spreadsheets.get.calledOnce).to.be.true;
            });
        });

        describe('deleteSheets', () => {
            it('should delete multiple sheets', async () => {
                await utils.deleteSheets(['Sheet1', 'Sheet2'], 'main');

                expect(sheetsStub.spreadsheets.get.calledOnce).to.be.true;
            });
        });

        describe('duplicateSheet', () => {
            it('should duplicate sheet with correct parameters', async () => {
                await utils.duplicateSheet('Sheet1', 'Sheet1Copy', 1, 'main');

                expect(sheetsStub.spreadsheets.get.calledOnce).to.be.true;
            });
        });

        describe('writeCell', () => {
            it('should write single cell', async () => {
                await utils.writeCell('Sheet1', 'A1', 'testValue', 'main');

                expect(sheetsStub.spreadsheets.values.batchUpdate.calledOnce).to.be.true;
                const args = sheetsStub.spreadsheets.values.batchUpdate.firstCall.args[0];
                expect(args.requestBody.data[0].range).to.equal('Sheet1!A1');
                expect(args.requestBody.data[0].values).to.deep.equal([['testValue']]);
            });

            it('should handle quoted cell references', async () => {
                await utils.writeCell('Sheet1', "'A1'", 'testValue', 'main');

                const args = sheetsStub.spreadsheets.values.batchUpdate.firstCall.args[0];
                expect(args.requestBody.data[0].range).to.equal('Sheet1!A1');
            });
        });

        describe('writeCells', () => {
            it('should write multiple cells', async () => {
                const cells = [
                    { sheetName: 'Sheet1', cell: 'A1', data: 'value1' },
                    { sheetName: 'Sheet1', cell: 'B2', data: 'value2' },
                    { sheetName: 'Sheet2', cell: 'C3', data: 'value3' },
                ];
                await utils.writeCells(cells, 'main');

                expect(sheetsStub.spreadsheets.values.batchUpdate.calledOnce).to.be.true;
                const args = sheetsStub.spreadsheets.values.batchUpdate.firstCall.args[0];
                expect(args.requestBody.data).to.have.lengthOf(3);
                expect(args.requestBody.data[0].range).to.equal('Sheet1!A1');
                expect(args.requestBody.data[1].range).to.equal('Sheet1!B2');
                expect(args.requestBody.data[2].range).to.equal('Sheet2!C3');
            });
        });

        describe('readCell', () => {
            it('should read cell value', async () => {
                const result = await utils.readCell('Sheet1', 'A1', 'main');

                expect(sheetsStub.spreadsheets.values.get.calledOnce).to.be.true;
                expect(result).to.equal('test');
            });

            it('should handle quoted cell references', async () => {
                await utils.readCell('Sheet1', "'A1'", 'main');

                const args = sheetsStub.spreadsheets.values.get.firstCall.args[0];
                expect(args.range).to.equal('Sheet1!A1');
            });

            it('should reject when no data found', async () => {
                sheetsStub.spreadsheets.values.get.resolves({ data: { values: [] } });

                try {
                    await utils.readCell('Sheet1', 'A1', 'main');
                    expect.fail('Should have thrown an error');
                } catch (error: any) {
                    expect(error.message).to.equal('No data found');
                }
            });
        });
    });
});
