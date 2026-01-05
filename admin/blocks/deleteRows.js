'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// --- Delete rows  --------------------------------------------------

Blockly.Words['google-spreadsheet_delete-rows_delete-from'] = { en: 'delete from', de: 'lösche von' };
Blockly.Words['google-spreadsheet_delete-rows_on-sheetName'] = { en: 'on sheet', de: 'auf Tabellenblatt' };
Blockly.Words['google-spreadsheet_delete-rows_startRow'] = { en: 'line', de: 'Zeile' };
Blockly.Words['google-spreadsheet_delete-rows_endRow'] = { en: 'to', de: 'bis' };

Blockly.GoogleSheets.blocks['google-spreadsheet.deleteRows'] =
    '<block type="google-spreadsheet.deleteRows">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="START_ROW">' +
    '         <shadow type="math_number">' +
    '             <field name="NUM1">1</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="END_ROW">' +
    '         <shadow type="math_number">' +
    '             <field name="NUM2">2</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.deleteRows'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_delete-rows_delete-from'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(
            Blockly.Translate('google-spreadsheet_delete-rows_on-sheetName'),
        );
        this.appendValueInput('START_ROW')
            .setCheck('Number')
            .appendField(Blockly.Translate('google-spreadsheet_delete-rows_startRow'));
        this.appendValueInput('END_ROW')
            .setCheck('Number')
            .appendField(Blockly.Translate('google-spreadsheet_delete-rows_endRow'));

        /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.deleteRows'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    const sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);

    const startRow = Blockly.JavaScript.valueToCode(block, 'START_ROW', Blockly.JavaScript.ORDER_ATOMIC);
    const endRow = Blockly.JavaScript.valueToCode(block, 'END_ROW', Blockly.JavaScript.ORDER_ATOMIC);
    return `await sendToAsync("google-spreadsheet${instance}", "deleteRows", {"sheetName":${sheetName},"start":${startRow}
    }, "end":${endRow}, "alias":"${alias}"});\n`;
};
