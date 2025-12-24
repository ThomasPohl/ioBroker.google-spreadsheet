'use strict';
/*global Blockly */
/*global getInstances */

/// --- Write Cell  --------------------------------------------------

Blockly.Words['google-spreadsheet_writeCell_write-to'] = { en: 'write to', de: 'Schreibe in ' };
Blockly.Words['google-spreadsheet_writeCell_sheetName'] = { en: 'on sheet', de: 'auf Tabellenblatt' };
Blockly.Words['google-spreadsheet_writeCell_cell'] = { en: 'in cell', de: 'in Zelle' };
Blockly.Words['google-spreadsheet_writeCell_data'] = { en: 'the data', de: 'die Daten' };


Blockly.Sendto.blocks['google-spreadsheet.writeCell'] =
    '<block type="google-spreadsheet.writeCell">' +
    '     <value name="NAME">' +
    '     </value>' +
    '     <value name="INSTANCE">' +
    '     </value>' +
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
    '     </value>' +
    '</block>';

Blockly.Words['google-spreadsheet_writeCells_write-to'] = { en: 'write cells to', de: 'Schreibe Zellen in ' };
Blockly.Words['google-spreadsheet_writeCells_cells'] = { en: 'cells', de: 'Zellen' };


Blockly.Sendto.blocks['google-spreadsheet.writeCells'] =
    '<block type="google-spreadsheet.writeCells">' +
    '     <value name="NAME">' +
    '     </value>' +
    '     <value name="INSTANCE">' +
    '     </value>' +
    '     <statement name="CELLS">' +
    '     </statement>' +
    '</block>';

Blockly.Sendto.blocks['google-spreadsheet.addCell'] =
    '<block type="google-spreadsheet.addCell"></block>';

Blockly.Blocks['google-spreadsheet.writeCells'] = {
    init: function () {
        // eslint-disable-next-line no-undef
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
        this.setColour(Blockly.Sendto.HUE);
    },
};

Blockly.JavaScript['google-spreadsheet.writeCells'] = function (block) {
    var dropdown_instance = block.getFieldValue('INSTANCE');
    var cellsCode = Blockly.JavaScript.statementToCode(block, 'CELLS');
    var cells = [];
    var cellRegex = /addCell\((\{[^}]+\})\);/g;
    var match;
    while ((match = cellRegex.exec(cellsCode)) !== null) {
        try {
            cells.push(eval('(' + match[1] + ')'));
        } catch (e) {}
    }
    return (
        `sendTo("google-spreadsheet${dropdown_instance}", "writeCells", {cells: ` + JSON.stringify(cells) + `});\n`
    );
};

Blockly.Blocks['google-spreadsheet.addCell'] = {
    init: function () {
        this.appendValueInput('SHEET_NAME').appendField('Sheet');
        this.appendValueInput('CELL').appendField('Cell');
        this.appendValueInput('DATA').appendField('Data');
        this.setPreviousStatement(true, 'google-spreadsheet.writeCell');
        this.setNextStatement(true, 'google-spreadsheet.writeCell');
        this.setColour(Blockly.Sendto.HUE);
    },
};

Blockly.JavaScript['google-spreadsheet.addCell'] = function (block) {
    var sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);
    var data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    return `addCell({sheetName: ${sheetName}, cell: ${cell}, data: ${data}});\n`;
};

Blockly.Blocks['google-spreadsheet.writeCell'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_writeCell_write-to'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_writeCell_sheetName'));

        this.appendValueInput('CELL').appendField(Blockly.Translate('google-spreadsheet_writeCell_cell'));

        this.appendValueInput('DATA').appendField(Blockly.Translate('google-spreadsheet_writeCell_data'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
    },
};

Blockly.JavaScript['google-spreadsheet.writeCell'] = function (block) {
    var dropdown_instance = block.getFieldValue('INSTANCE');
    var sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);
    var data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);

    return (
        `sendTo("google-spreadsheet${dropdown_instance}", "writeCell", {"sheetName": ${sheetName}, "cell": ${
            cell
        }, "data":${data}}` + `);\n`
    );
};
