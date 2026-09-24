'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_clearRange_clear'] = { en: 'clear range in', de: 'Lösche Bereich in' };
Blockly.Words['google-spreadsheet_clearRange_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_clearRange_in-range'] = { en: 'range', de: 'Bereich' };

Blockly.GoogleSheets.blocks['google-spreadsheet.clearRange'] =
    '<block type="google-spreadsheet.clearRange">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME"><shadow type="text"><field name="TEXT">Sheet1</field></shadow></value>' +
    '     <value name="RANGE"><shadow type="text"><field name="TEXT">A1:B2</field></shadow></value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.clearRange'] = {
    init: function () {
        const instances = getInstances();
        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_clearRange_clear'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_clearRange_on-sheetName'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_clearRange_in-range'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.clearRange'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);

    return `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "clearRange", {sheet:${sheetName}, range:${range}, alias:"${alias}"}, ()=>{resolve();}, ()=>{resolve();}); });\n`;
};
