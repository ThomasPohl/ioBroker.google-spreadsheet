'use strict';
/*global Blockly */
/*global getInstances */

/// --- Write Cells  --------------------------------------------------

Blockly.Words['google-spreadsheet_writeCells_write-to'] = { en: 'write cells to', de: 'Schreibe Zellen in ' };
Blockly.Words['google-spreadsheet_writeCells_cells'] = { en: 'cells', de: 'Zellen' };

Blockly.GoogleSpreadsheet.blocks['google-spreadsheet.writeCells'] =
    '<block type="google-spreadsheet.writeCells">' +
    '     <field name="INSTANCE"></field>' +
    '     <statement name="CELLS"></statement>' +
    '</block>';

// addCell-Block in die Toolbox aufnehmen, damit er auswählbar ist
Blockly.GoogleSpreadsheet.blocks['google-spreadsheet.addCell'] =
    '<block type="google-spreadsheet.addCell">' +
    '     <field name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </field>' +
    '     <field name="CELL">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">A1</field>' +
    '         </shadow>' +
    '     </field>' +
    '     <field name="DATA">' +
    '         <shadow type="text">' +
    '             <field name="TEXT"></field>' +
    '         </shadow>' +
    '     </field>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.writeCells'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_writeCells_write-to'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendStatementInput('CELLS')
            .setCheck('google-spreadsheet.writeCell')
            .appendField(Blockly.Translate('google-spreadsheet_writeCells_cells'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSpreadsheet.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.writeCells'] = function (block) {
    const dropdown_instance = block.getFieldValue('INSTANCE');
    const cellsCode = Blockly.JavaScript.statementToCode(block, 'CELLS');
    // cellsCode enthält mehrere Zeilen wie: addCell({sheetName: ..., cell: ..., data: ...});
    // Wir sammeln die Argumente in ein Array
    const cells = [];
    const cellRegex = /addCell\((\{[^}]+\})\);/g;
    let match;
    while ((match = cellRegex.exec(cellsCode)) !== null) {
        try {
            cells.push(eval(`(${match[1]})`));
        } catch (e) {
            console.error('Error parsing cell data:', e);
        }
    }
    return `sendTo("google-spreadsheet${dropdown_instance}", "writeCells", {cells: ${JSON.stringify(cells)}});\n`;
};

// Hilfsblock für einzelne Zelleingabe (nur für writeCells)
Blockly.Blocks['google-spreadsheet.addCell'] = {
    init: function () {
        this.appendValueInput('SHEET_NAME').appendField('Sheet');
        this.appendValueInput('CELL').appendField('Cell');
        this.appendValueInput('DATA').appendField('Data');
        this.setPreviousStatement(true, 'google-spreadsheet.writeCell');
        this.setNextStatement(true, 'google-spreadsheet.writeCell');
        this.setColour(Blockly.GoogleSpreadsheet.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.addCell'] = function (block) {
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);
    const data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    return `addCell({sheetName: ${sheetName}, cell: ${cell}, data: ${data}});\n`;
};
