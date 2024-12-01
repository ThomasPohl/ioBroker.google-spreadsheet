'use strict';
var Blockly = Blockly || undefined;

/// --- Append  --------------------------------------------------

Blockly.Words['google-spreadsheet_append_add-to'] = { en: 'append to', de: 'füge zu' };
Blockly.Words['google-spreadsheet_append_on-sheetName'] = { en: 'on sheet', de: 'auf Tabellenblatt' };
Blockly.Words['google-spreadsheet_append_data'] = { en: 'the data', de: 'die Daten' };
Blockly.Words['google-spreadsheet_append_add-to-suffix'] = { en: '', de: 'hinzu' };

Blockly.Sendto.blocks['google-spreadsheet.append'] =
    '<block type="google-spreadsheet.append">' +
    '     <value name="NAME">' +
    '     </value>' +
    '     <value name="INSTANCE">' +
    '     </value>' +
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

        this.setColour(Blockly.Sendto.HUE);
    },
};

Blockly.JavaScript['google-spreadsheet.append'] = function (block) {
    var dropdown_instance = block.getFieldValue('INSTANCE');
    var data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
    if (!data) {
        data = '{}';
    }
    var sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    return `sendTo("google-spreadsheet${dropdown_instance}", "append", {"sheetName":${sheetName}, "data":${data}});\n`;
};
