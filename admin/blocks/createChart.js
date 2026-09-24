'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_createChart_create'] = { en: 'create chart in', de: 'Erzeuge Diagramm in' };
Blockly.Words['google-spreadsheet_createChart_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_createChart_title'] = { en: 'title', de: 'Titel' };
Blockly.Words['google-spreadsheet_createChart_range'] = { en: 'range', de: 'Bereich' };
Blockly.Words['google-spreadsheet_createChart_type'] = { en: 'type', de: 'Typ' };

Blockly.GoogleSheets.blocks['google-spreadsheet.createChart'] =
    '<block type="google-spreadsheet.createChart">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME"><shadow type="text"><field name="TEXT">Sheet1</field></shadow></value>' +
    '     <value name="TITLE"><shadow type="text"><field name="TEXT">Temperature</field></shadow></value>' +
    '     <value name="RANGE"><shadow type="text"><field name="TEXT">A1:B10</field></shadow></value>' +
    '     <value name="TYPE"><shadow type="text"><field name="TEXT">line</field></shadow></value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.createChart'] = {
    init: function () {
        const instances = getInstances();
        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_createChart_create'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_createChart_on-sheetName'));
        this.appendValueInput('TITLE').appendField(Blockly.Translate('google-spreadsheet_createChart_title'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_createChart_range'));
        this.appendValueInput('TYPE').appendField(Blockly.Translate('google-spreadsheet_createChart_type'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.createChart'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);
    const type = Blockly.JavaScript.valueToCode(block, 'TYPE', Blockly.JavaScript.ORDER_ATOMIC);

    return `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "createChart", {sheet:${sheetName}, chart:{title:${title}, chartType:${type}, range:${range}}, alias:"${alias}"}, ()=>{resolve();}, ()=>{resolve();}); });\n`;
};
