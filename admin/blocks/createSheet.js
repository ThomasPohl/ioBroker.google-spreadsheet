/// ---Create sheet  --------------------------------------------------
Blockly.Words["google-spreadsheet_create-sheet_create-in"] = { en: "create in", de: "erstelle in" }
Blockly.Words["google-spreadsheet_create-sheet_sheet-name"] = { en: "a sheet with name", de: "ein Blatt mit dem Namen" }

Blockly.Sendto.blocks["google-spreadsheet.createSheet"] =
'<block type="google-spreadsheet.createSheet">' +
'     <value name="NAME">' +
'     </value>' + 
'     <value name="INSTANCE">' +
'     </value>' +
'     <value name="SHEET_NAME">' +
'         <shadow type="text">' +
'             <field name="TEXT">text</field>' +
'         </shadow>' +
'     </value>' +
"</block>";

Blockly.Blocks["google-spreadsheet.createSheet"] = {
    init: function () {
        const instances = getInstances();

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_create-sheet_create-in"))
            .appendField(new Blockly.FieldDropdown(instances), "INSTANCE");

        this.appendValueInput("SHEET_NAME")
            .appendField(Blockly.Translate("google-spreadsheet_create-sheet_sheet-name"));

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("google-spreadsheet_tooltip"));
        this.setHelpUrl(Blockly.Translate("google-spreadsheet_help"));
    },
};

Blockly.JavaScript["google-spreadsheet.createSheet"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var data = Blockly.JavaScript.valueToCode(block, "SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);

    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "createSheet", ' + data + ");\n";
};
