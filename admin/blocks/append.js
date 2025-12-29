'use strict';
/*global Blockly:true */
/*global getInstances:true */

/// --- Append  --------------------------------------------------
Blockly.Words['google-spreadsheet_append_add-to'] = { en: 'append to', de: 'füge zu' };
Blockly.Words['google-spreadsheet_append_on-sheetName'] = { en: 'on sheet', de: 'auf Tabellenblatt' };
Blockly.Words['google-spreadsheet_append_data'] = { en: 'the data', de: 'die Daten' };
Blockly.Words['google-spreadsheet_append_add-to-suffix'] = { en: ' ', de: 'hinzu' };

Blockly.GoogleSpreadsheet.blocks['google-spreadsheet.append'] =
    '<block type="google-spreadsheet.append">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="DATA">' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.append'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('NAME')
            .appendField(Blockly.Translate('google-spreadsheet_append_add-to'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(Blockly.Translate('google-spreadsheet_append_on-sheetName'));

        this.appendValueInput('DATA').appendField(Blockly.Translate('google-spreadsheet_append_data'));

        this.appendDummyInput().appendField(Blockly.Translate('google-spreadsheet_append_add-to-suffix'));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSpreadsheet.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.append'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    let data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    if (!data) {
        data = '{}';
    }
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    return `sendTo("google-spreadsheet${instance}", "append", {"sheetName":${sheetName}, "alias":"${alias}", "data":${data}});\n`;
};
