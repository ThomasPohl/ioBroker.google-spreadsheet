'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// --- Read Cell  --------------------------------------------------

Blockly.Words['google-spreadsheet_read_read-from'] = { en: 'read from', de: 'Lies von' };
Blockly.Words['google-spreadsheet_read_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_read_in-cell'] = { en: 'cell', de: 'Zelle' };
Blockly.GoogleSheets.blocks['google-spreadsheet.read'] =
    '<block type="google-spreadsheet.read">' +
    '     <field name="INSTANCE"></field>' +
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
    '</block>';

Blockly.Blocks['google-spreadsheet.read'] = {
    init: function () {
        const instances = getInstances(false);

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_read_read-from'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_read_on-sheetName'));

        this.appendValueInput('CELL').appendField(Blockly.Translate('google-spreadsheet_read_in-cell'));

        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'String');

        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.read'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);

    return `await sendToAsync("google-spreadsheet${instance}", "readCell", {sheetName: ${sheetName}, cell: ${cell}, alias: "${alias}"})`;
};
