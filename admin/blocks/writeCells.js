'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// --- Write Cells  --------------------------------------------------

Blockly.Words['google-spreadsheet_writeCells_write-to'] = { en: 'write cells to', de: 'Schreibe Zellen in ' };
Blockly.Words['google-spreadsheet_writeCells_cells'] = { en: 'cells', de: 'Zellen' };

Blockly.GoogleSheets.blocks['google-spreadsheet.writeCells'] =
    '<block type="google-spreadsheet.writeCells">' +
    '     <field name="INSTANCE"></field>' +
    '     <statement name="CELLS"></statement>' +
    '</block>';

// addCell-Block in die Toolbox aufnehmen, damit er auswählbar ist
Blockly.GoogleSheets.blocks['google-spreadsheet.addCell'] =
    '<block type="google-spreadsheet.addCell">' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="CELL">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">A1</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="DATA">' +
    '         <shadow type="text">' +
    '             <field name="TEXT"></field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.writeCells'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_writeCells_write-to'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendStatementInput('CELLS')
            .setCheck('google-spreadsheet.addCell')
            .appendField(Blockly.Translate('google-spreadsheet_writeCells_cells'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.writeCells'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    // cellsCode enthält mehrere Zeilen wie: ({sheet: ..., cell: ..., value: ...}), ...
    const cellsCode = Blockly.JavaScript.statementToCode(block, 'CELLS');
    // Baue ein Array aus den Objekten
    const cellsArray = `[${cellsCode.replace(/\n/g, '').replace(/,$/, '')}]`;
    const statement = `sendTo("google-spreadsheet${instance}", "writeCells", {cells: ${cellsArray}, alias: "${alias}"})`;
    return `${statement};\n`;
};

// Hilfsblock für einzelne Zelleingabe (nur für writeCells)
Blockly.Blocks['google-spreadsheet.addCell'] = {
    init: function () {
        this.appendValueInput('SHEET_NAME').appendField('Sheet');
        this.appendValueInput('CELL').appendField('Cell');
        this.appendValueInput('DATA').appendField('Data');
        this.setPreviousStatement(true, 'google-spreadsheet.addCell');
        this.setNextStatement(true, 'google-spreadsheet.addCell');
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.addCell'] = function (block) {
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);
    const data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    return `{sheet: ${sheetName}, cell: ${cell}, value: ${data}},\n`;
};
