'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_delete-sheets_delete-on'] = { en: 'delete sheets in', de: 'lösche Blätter in' };
Blockly.Words['google-spreadsheet_delete-sheets_sheetNames'] = {
    en: 'the sheets with names (array)',
    de: 'die Blätter mit Namen (Array)',
};

Blockly.GoogleSheets.blocks['google-spreadsheet.deleteSheets'] =
    '<block type="google-spreadsheet.deleteSheets">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAMES">' +
    '         <shadow type="lists_create_with"></shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.deleteSheets'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_delete-sheets_delete-on'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAMES')
            .setCheck('Array')
            .appendField(Blockly.Translate('google-spreadsheet_delete-sheets_sheetNames'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
};

Blockly.Blocks['google-spreadsheet.deleteSheets'].mutator = 'google-spreadsheet_deleteSheets_mutator';

Blockly.JavaScript.forBlock['google-spreadsheet.deleteSheets'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const data = Blockly.JavaScript.valueToCode(block, 'SHEET_NAMES', Blockly.JavaScript.ORDER_ATOMIC);

    return `await sendToAsync("google-spreadsheet${instance}", "deleteSheets", {sheetNames: ${data}, alias: "${alias}"});\n`;
};
