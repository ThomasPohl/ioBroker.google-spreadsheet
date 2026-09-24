'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_writeRange_write-to'] = { en: 'write range to', de: 'Schreibe Bereich in' };
Blockly.Words['google-spreadsheet_writeRange_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_writeRange_in-range'] = { en: 'range', de: 'Bereich' };
Blockly.Words['google-spreadsheet_writeRange_values'] = { en: 'values', de: 'Werte' };

Blockly.GoogleSheets.blocks['google-spreadsheet.writeRange'] =
    '<block type="google-spreadsheet.writeRange">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text"><field name="TEXT">Sheet1</field></shadow>' +
    '     </value>' +
    '     <value name="RANGE">' +
    '         <shadow type="text"><field name="TEXT">A1:B2</field></shadow>' +
    '     </value>' +
    '     <value name="VALUES">' +
    '         <shadow type="text"><field name="TEXT">[[\'a\', \'b\']]</field></shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.writeRange'] = {
    init: function () {
        const instances = getInstances();
        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_writeRange_write-to'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_writeRange_on-sheetName'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_writeRange_in-range'));
        this.appendValueInput('VALUES').appendField(Blockly.Translate('google-spreadsheet_writeRange_values'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.writeRange'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);
    const values = Blockly.JavaScript.valueToCode(block, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC);

    return `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "writeRange", {sheet:${sheetName}, range:${range}, values:${values}, alias:"${alias}"}, ()=>{resolve();}, ()=>{resolve();}); });\n`;
};
