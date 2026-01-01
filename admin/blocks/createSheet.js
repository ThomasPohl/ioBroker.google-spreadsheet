'use strict';
/*global Blockly:true */
/*global getInstances:true */

/// ---Create sheet  --------------------------------------------------
Blockly.Words['google-spreadsheet_create-sheet_create-in'] = { en: 'create in', de: 'erstelle in' };
Blockly.Words['google-spreadsheet_create-sheet_sheet-name'] = {
    en: 'a sheet with name',
    de: 'ein Blatt mit dem Namen',
};

Blockly.GoogleSheets.blocks['google-spreadsheet.createSheet'] =
    '<block type="google-spreadsheet.createSheet">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.createSheet'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_create-sheet_create-in'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(
            Blockly.Translate('google-spreadsheet_create-sheet_sheet-name'),
        );

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.createSheet'] = function (block) {
    const dropdown_instance = block.getFieldValue('INSTANCE');
    const data = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    return `sendTo("google-spreadsheet${dropdown_instance}", "createSheet", ${data});\n`;
};
