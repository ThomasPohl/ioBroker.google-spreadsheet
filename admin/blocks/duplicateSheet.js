'use strict';
/*global Blockly:true */
/*global getInstances:true */

Blockly.Words['google-spreadsheet_duplicate-sheet_duplicate-in'] = { en: 'duplicate in ', de: 'dupliziere in' };
Blockly.Words['google-spreadsheet_duplicate-sheet_sheetName'] = {
    en: 'the sheet with the name',
    de: 'das Blatt mit dem Namen',
};
Blockly.Words['google-spreadsheet_duplicate-sheet_newSheetName'] = { en: 'new name', de: 'neuer Name' };
Blockly.Words['google-spreadsheet_duplicate-sheet_newPosition'] = { en: 'at position', de: 'an Position' };

Blockly.GoogleSheets.blocks['google-spreadsheetduplicateSheet'] =
    '<block type="google-spreadsheet.duplicateSheet">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="NEW_SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="NEW_POSITION">' +
    '         <shadow type="math_number">' +
    '             <field name="NUM">0</field>' +
    '         </shadow>' +
    '     </value>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.duplicateSheet'] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_duplicate-sheet_duplicate-in'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(
            Blockly.Translate('google-spreadsheet_duplicate-sheet_sheetName'),
        );

        this.appendValueInput('NEW_SHEET_NAME').appendField(
            Blockly.Translate('google-spreadsheet_duplicate-sheet_newSheetName'),
        );

        this.appendValueInput('NEW_POSITION').appendField(
            Blockly.Translate('google-spreadsheet_duplicate-sheet_newPosition'),
        );

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.GoogleSheets.HUE);
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.duplicateSheet'] = function (block) {
    const dropdown_instance = block.getFieldValue('INSTANCE');
    const source = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    const target = Blockly.JavaScript.valueToCode(block, 'NEW_SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let index = Blockly.JavaScript.valueToCode(block, 'NEW_POSITION', Blockly.JavaScript.ORDER_ATOMIC);
    if (!index) {
        index = -1;
    }

    return (
        `sendTo("google-spreadsheet${dropdown_instance}", "duplicateSheet", {"source": ${source}, "target": ${
            target
        }, "index":${index}}` + `);\n`
    );
};
