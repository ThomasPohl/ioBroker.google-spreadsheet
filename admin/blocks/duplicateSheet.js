Blockly.Words["google-spreadsheet_duplicate-sheet_duplicate-in"] = { en: "duplicate in ", de: "dupliziere in" }
Blockly.Words["google-spreadsheet_duplicate-sheet_sheetName"] = { en: "the sheet with the name", de: "das Blatt mit dem Namen" };
Blockly.Words["google-spreadsheet_duplicate-sheet_newSheetName"] = { en: "new name", de: "neuer Name" };



Blockly.Sendto.blocks["google-spreadsheetduplicateSheet"] =
'<block type="google-spreadsheet.duplicateSheet">' +
'     <value name="INSTANCE">' +
'     </value>' +
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
'</block>';





Blockly.Blocks["google-spreadsheet.duplicateSheet"] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_duplicate-sheet_duplicate-in"))
            .appendField(new Blockly.FieldDropdown(instances), "INSTANCE");

        this.appendValueInput("SHEET_NAME")
            .appendField(Blockly.Translate("google-spreadsheet_duplicate-sheet_sheetName"));

        this.appendValueInput("NEW_SHEET_NAME")
            .appendField(Blockly.Translate("google-spreadsheet_duplicate-sheet_newSheetName"));

        /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
    },
};

Blockly.JavaScript["google-spreadsheet.duplicateSheet"] = function (block) {
var dropdown_instance = block.getFieldValue("INSTANCE");
var source = Blockly.JavaScript.valueToCode(block, "SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);
var target = Blockly.JavaScript.valueToCode(block, "NEW_SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);

return 'sendTo("google-spreadsheet' + dropdown_instance + '", "duplicateSheet", {"source": '+source+', "target": '+target+'}' + ");\n";
};
