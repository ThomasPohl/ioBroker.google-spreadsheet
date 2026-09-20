'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// --- Get Last Row  --------------------------------------------------

Blockly.Words['google-spreadsheet_getLastRow_get-from'] = { en: 'get last row from', de: 'get last row from' };
Blockly.Words['google-spreadsheet_getLastRow_sheet'] = { en: 'sheet', de: 'sheet' };

Blockly.GoogleSheets.blocks['google-spreadsheet.getLastRow'] =
    '<block type="google-spreadsheet.getLastRow">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">Sheet1</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.getLastRow'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_getLastRow_get-from'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_getLastRow_sheet'));

        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Number');
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.getLastRow'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    return [
        `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "getLastRow", {sheet: ${sheetName}, alias: "${alias}"}, (response)=>{resolve(response)}, (response)=>{console.log('Error: ' + response.error); resolve(0);}); })`,
        Blockly.JavaScript.ORDER_ATOMIC,
    ];
};
