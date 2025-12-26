'use strict';
/*global Blockly:true */
/*global getInstances:true */

Blockly.Words['google-spreadsheet_delete-sheets_delete-on'] = { en: 'delete sheets in', de: 'lösche Blätter in' };
Blockly.Words['google-spreadsheet_delete-sheets_sheetNames'] = {
    en: 'the sheets with names (array)',
    de: 'die Blätter mit Namen (Array)',
};


Blockly.Sendto.blocks['google-spreadsheet.deleteSheets'] =
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

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
};

Blockly.Extensions.registerMutator('google-spreadsheet_deleteSheets_mutator', {
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10) || 1;
        this.updateShape_();
    },
    updateShape_: Blockly.Blocks['google-spreadsheet.deleteSheets'].updateShape_
}, undefined, ['']);


Blockly.Blocks['google-spreadsheet.deleteSheets'].mutator = 'google-spreadsheet_deleteSheets_mutator';


Blockly.JavaScript.forBlock['google-spreadsheet.deleteSheets'] = function (block) {
    const dropdown_instance = block.getFieldValue('INSTANCE');
    const data = Blockly.JavaScript.valueToCode(block, 'SHEET_NAMES', Blockly.JavaScript.ORDER_ATOMIC);

    return `sendTo("google-spreadsheet${dropdown_instance}", "deleteSheets", ${data});\n`;
};
