import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import { expect } from 'chai';

declare const describe: (description: string, suite: () => void) => void;
declare const it: (description: string, test: () => void) => void;

const inputCode: Record<string, string> = {
    SHEET_NAME: "'Sheet1'",
    CELL: "'A1'",
    DATA: "'value'",
    RANGE: "'A1:B2'",
    VALUES: "[['a', 'b']]",
    START_ROW: '1',
    END_ROW: '2',
    SHEET_NAMES: "['Sheet1']",
    NEW_SHEET_NAME: "'Copy'",
    NEW_POSITION: '1',
    TITLE: "'Temperature'",
    TYPE: "'line'",
    CHART_ID: '1',
    FORMAT: '({ backgroundColor: { red: 1, green: 0, blue: 0 } })',
};

function createBlocklyContext(): ReturnType<typeof createContext> {
    const Blockly = {
        Words: {} as Record<string, unknown>,
        CustomBlocks: [] as string[],
        GoogleSheets: { blocks: {} as Record<string, string>, HUE: 'green' },
        Blocks: {} as Record<string, any>,
        JavaScript: {
            forBlock: {} as Record<string, (block: any) => string | [string, number]>,
            ORDER_ATOMIC: 0,
            valueToCode: (_block: unknown, input: string): string => inputCode[input] ?? "'value'",
            statementToCode: (_block: unknown, input: string): string =>
                input === 'CELLS'
                    ? "{ sheet: 'Sheet1', cell: 'A1', value: 'value' },\n"
                    : 'await Promise.resolve();\nawait Promise.resolve();\n',
        },
        FieldDropdown: class {},
        FieldTextInput: class {},
        icons: { MutatorIcon: class {} },
        Translate: (key: string): string => key,
    };
    const context = createContext({
        Blockly,
        console: { log: () => {}, error: () => {} },
        document: { createElement: () => ({}), body: { appendChild: () => {} } },
        window: {},
    });

    const adminPath = resolve(__dirname, '../../admin');
    new Script(readFileSync(join(adminPath, 'blockly.js'), 'utf8')).runInContext(context);
    for (const filename of readdirSync(join(adminPath, 'blocks'))
        .filter(name => name.endsWith('.js'))
        .sort()) {
        new Script(readFileSync(join(adminPath, 'blocks', filename), 'utf8'), { filename }).runInContext(context);
    }

    return context;
}

function initializeBlock(blockDefinition: any): boolean {
    let hasOutput = false;
    const input = {
        appendField: () => input,
        setCheck: () => input,
    };
    const block = {
        appendDummyInput: () => input,
        appendValueInput: () => input,
        appendStatementInput: () => input,
        setInputsInline: () => {},
        setPreviousStatement: () => {},
        setNextStatement: () => {},
        setOutput: (output: boolean) => {
            hasOutput = output;
        },
        setColour: () => {},
        setTooltip: () => {},
        setHelpUrl: () => {},
        setMutator: () => {},
        getInput: () => null,
    };
    blockDefinition.init.call(block);
    return hasOutput;
}

describe('Blockly code generators', () => {
    const context = createBlocklyContext();
    const Blockly = (context as any).Blockly;
    const generators: [string, (block: any) => string | [string, number]][] = Object.entries(
        Blockly.JavaScript.forBlock,
    );

    expect(generators.length).to.be.greaterThan(0);

    for (const [type, generator] of generators) {
        it(`generates compilable JavaScript for ${type}`, () => {
            const definition = Blockly.Blocks[type];
            expect(definition, `Missing Blockly definition for ${type}`).to.exist;
            const hasOutput = initializeBlock(definition);
            const block = {
                getFieldValue: (field: string): string =>
                    field === 'INSTANCE' ? '.1|test' : '{"backgroundColor":{"red":1}}',
                getInput: () => null,
            };
            const generated = generator(block);
            const code = Array.isArray(generated) ? generated[0] : generated;
            const isCellEntry = type === 'google-spreadsheet.addCell';
            const source = hasOutput || isCellEntry ? `(${code.replace(/,\s*$/, '')});` : code;

            expect(code, `Generator ${type} returned no code`).to.be.a('string').and.not.empty;
            const asyncScript = `(async function () {\n${source}\n})();`;
            expect(() => new Script(asyncScript, { filename: `${type}.js` })).not.to.throw();
        });
    }

    it('provides nested list shadows and generates an array payload for writeRange', () => {
        const toolboxBlock = Blockly.GoogleSheets.blocks['google-spreadsheet.writeRange'];
        expect(toolboxBlock).to.include('<value name="VALUES">');
        expect((toolboxBlock.match(/<shadow type="lists_create_with">/g) ?? [])).to.have.length(3);
        expect(toolboxBlock).not.to.include('<shadow type="text"><field name="TEXT">[[');

        const generated = Blockly.JavaScript.forBlock['google-spreadsheet.writeRange']({
            getFieldValue: (field: string): string => (field === 'INSTANCE' ? '.1|test' : ''),
        });
        expect(generated).to.include("values:[['a', 'b']]");
    });
});
