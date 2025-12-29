'use strict';
/*global Blockly:true */
/*global getInstances:true */

/// --- Read Cell  --------------------------------------------------

Blockly.Words['google-spreadsheet_read_read-from'] = { en: 'read from', de: 'Lies von' };
Blockly.Words['google-spreadsheet_read_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_read_in-cell'] = { en: 'cell', de: 'Zelle' };
Blockly.GoogleSpreadsheet.blocks['google-spreadsheet.read'] =
    '<block type="google-spreadsheet.read">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="RANGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
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

        this.setColour(Blockly.GoogleSpreadsheet.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.read'] = function (block) {
    const dropdown_instance = block.getFieldValue('INSTANCE');
    let data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    if (!data) {
        data = '{}';
    }
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const cell = Blockly.JavaScript.valueToCode(block, 'CELL', Blockly.JavaScript.ORDER_ATOMIC);

    return [
        `await new Promise((resolve)=>{sendTo("google-spreadsheet${dropdown_instance}", "readCell", {"sheetName":"${
            sheetName
        }", "cell":"${cell}"}, (response)=>{resolve(response)}); })`,
        0,
    ];
};
