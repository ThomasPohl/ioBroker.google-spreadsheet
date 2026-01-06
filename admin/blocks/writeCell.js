'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */
/*global makeAsync */

/// --- Write Cell  --------------------------------------------------

Blockly.Words['google-spreadsheet_writeCell_write-to'] = { en: 'write to', de: 'Schreibe in ' };
Blockly.Words['google-spreadsheet_writeCell_sheetName'] = { en: 'on sheet', de: 'auf Tabellenblatt' };
Blockly.Words['google-spreadsheet_writeCell_cell'] = { en: 'in cell', de: 'in Zelle' };
Blockly.Words['google-spreadsheet_writeCell_data'] = { en: 'the data', de: 'die Daten' };

Blockly.GoogleSheets.blocks['google-spreadsheet.writeCell'] =
    '<block type="google-spreadsheet.writeCell">' +
    '     <field name="INSTANCE"></field>' +
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
    '     <value name="DATA">' +
    '     </value>' +
    '</block>';

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

        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.writeCell'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);
    const data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);

    const statement = `sendTo("google-spreadsheet${instance}", "writeCell", {sheet:${sheetName}, cell:${cell}, value:${data}, alias:"${alias}"})`;
    return makeAsync(statement);
};
