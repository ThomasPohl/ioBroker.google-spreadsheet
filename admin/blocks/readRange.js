'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_readRange_read-from'] = { en: 'read range from', de: 'Lese Bereich aus' };
Blockly.Words['google-spreadsheet_readRange_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_readRange_in-range'] = { en: 'range', de: 'Bereich' };

Blockly.GoogleSheets.blocks['google-spreadsheet.readRange'] =
    '<block type="google-spreadsheet.readRange">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="RANGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">A1:B5</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.readRange'] = {
    init: function () {
        const instances = getInstances(false);

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_readRange_read-from'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_readRange_on-sheetName'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_readRange_in-range'));

        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Array');
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.readRange'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);

    return [
        `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "readRange", {sheet:${sheetName}, range:${range}, alias:"${alias}"}, (response)=>{resolve(response.values ?? response)}, (response)=>{console.log('Error: ' + response.error); resolve([]);}); })`,
        Blockly.JavaScript.ORDER_ATOMIC,
    ];
};
