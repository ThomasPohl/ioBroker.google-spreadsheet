'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// --- Read Cells  --------------------------------------------------

Blockly.Words['google-spreadsheet_readcells_read-from'] = { en: 'read from', de: 'Lies von' };
Blockly.Words['google-spreadsheet_readcells_on-sheetName'] = { en: 'sheet', de: 'Tabellenblatt' };
Blockly.Words['google-spreadsheet_readcells_in-range'] = { en: 'range', de: 'Bereich' };
Blockly.GoogleSheets.blocks['google-spreadsheet.readCells'] =
    '<block type="google-spreadsheet.readCells">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="RANGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">A1:A7</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.readCells'] = {
    init: function () {
        const instances = getInstances(false);

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_readcells_read-from'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_readcells_on-sheetName'));

        this.appendValueInput('RANGE').appendField(Blockly.Translate('google-spreadsheet_readcells_in-range'));

        this.setInputsInline(true);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setOutput(true, 'Array');

        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.readCells'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const range = Blockly.JavaScript.valueToCode(block, 'RANGE', Blockly.JavaScript.ORDER_ATOMIC);

    return [
        `await new Promise((resolve)=>{sendTo("google-spreadsheet${instance}", "readCells", {sheet: ${sheetName}, range: ${range}, alias: "${alias}"}, (response)=>{resolve(response)}, (response)=>{console.log('Error: ' + response.error); resolve([]);}); })`,
        Blockly.JavaScript.ORDER_ATOMIC,
    ];
};
