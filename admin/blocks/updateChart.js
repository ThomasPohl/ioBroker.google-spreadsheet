'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

Blockly.Words['google-spreadsheet_updateChart_update'] = { en: 'update chart in', de: 'Aktualisiere Diagramm in' };
Blockly.Words['google-spreadsheet_updateChart_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_updateChart_id'] = { en: 'chart id', de: 'Diagramm-ID' };
Blockly.Words['google-spreadsheet_updateChart_title'] = { en: 'title', de: 'Titel' };
Blockly.Words['google-spreadsheet_updateChart_range'] = { en: 'range', de: 'Bereich' };
Blockly.Words['google-spreadsheet_updateChart_type'] = { en: 'type', de: 'Typ' };

Blockly.GoogleSheets.blocks['google-spreadsheet.updateChart'] =
    '<block type="google-spreadsheet.updateChart">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME"><shadow type="text"><field name="TEXT">Sheet1</field></shadow></value>' +
    '     <value name="CHART_ID"><shadow type="math_number"><field name="NUM">0</field></shadow></value>' +
    '     <value name="TITLE"><shadow type="text"><field name="TEXT">Temperature</field></shadow></value>' +
    '     <value name="RANGE"><shadow type="text"><field name="TEXT">A1:B10</field></shadow></value>' +
    '     <value name="TYPE"><shadow type="text"><field name="TEXT">line</field></shadow></value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.updateChart'] = {
    init: function () {
        const instances = getInstances();
        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_updateChart_update'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_updateChart_on-sheetName'));
        this.appendValueInput('CHART_ID').appendField(Blockly.Translate('google-spreadsheet_updateChart_id'));
        this.appendValueInput('TITLE').appendField(Blockly.Translate('google-spreadsheet_updateChart_title'));
        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_updateChart_range'));
        this.appendValueInput('TYPE').appendField(Blockly.Translate('google-spreadsheet_updateChart_type'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.updateChart'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const chartId = Blockly.JavaScript.valueToCode(block, 'CHART_ID', Blockly.JavaScript.ORDER_ATOMIC);
    const title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);
    const type = Blockly.JavaScript.valueToCode(block, 'TYPE', Blockly.JavaScript.ORDER_ATOMIC);

    return `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "updateChart", {sheet:${sheetName}, chartId:${chartId}, chart:{title:${title}, chartType:${type}, range:${range}}, alias:"${alias}"}, ()=>{resolve();}, ()=>{resolve();}); });\n`;
};
