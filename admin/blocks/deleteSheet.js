'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_delete-sheet_delete-on'] = { en: 'delete in', de: 'lösche in' };
Blockly.Words['google-spreadsheet_delete-sheet_sheetName'] = {
    en: 'the sheet with the name',
    de: 'das Blatt mit dem Namen',
};

Blockly.GoogleSheets.blocks['google-spreadsheet.deleteSheet'] =
    '<block type="google-spreadsheet.deleteSheet">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.deleteSheet'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_delete-sheet_delete-on'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_delete-sheet_sheetName'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.deleteSheet'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    return `await sendToAsync("google-spreadsheet${instance}", "deleteSheet", {"sheetName":${sheetName}, "alias":"${alias}"});\n`;
};
