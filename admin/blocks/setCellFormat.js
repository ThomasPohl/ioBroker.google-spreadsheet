'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_setCellFormat_format-range'] = { en: 'set format for range in', de: 'Setze Format für Bereich in' };
Blockly.Words['google-spreadsheet_setCellFormat_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_setCellFormat_in-range'] = { en: 'range', de: 'Bereich' };
Blockly.Words['google-spreadsheet_setCellFormat_format'] = { en: 'format', de: 'Format' };

Blockly.GoogleSheets.blocks['google-spreadsheet.setCellFormat'] =
    '<block type="google-spreadsheet.setCellFormat">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME"><shadow type="text"><field name="TEXT">Sheet1</field></shadow></value>' +
    '     <value name="RANGE"><shadow type="text"><field name="TEXT">A1:B2</field></shadow></value>' +
    '     <value name="FORMAT"><shadow type="dict"><field name="DICT">{backgroundColor:{red:1,green:0,blue:0}, textFormat:{bold:true}}</field></shadow></value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.setCellFormat'] = {
    init: function () {
        const instances = getInstances();
        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_setCellFormat_format-range'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_setCellFormat_on-sheetName'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_setCellFormat_in-range'));
        this.appendValueInput('FORMAT').appendField(Blockly.Translate('google-spreadsheet_setCellFormat_format'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.setCellFormat'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);
    const format = Blockly.JavaScript.valueToCode(block, 'FORMAT', Blockly.JavaScript.ORDER_ATOMIC);

    return `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "setCellFormat", {sheet:${sheetName}, range:${range}, format:${format}, alias:"${alias}"}, ()=>{resolve();}, ()=>{resolve();}); });\n`;
};
