"use strict";

/// --- Write Cell  --------------------------------------------------

Blockly.Words["google-spreadsheet_write_write-to"] = { en: "write to", de: "Schreibe" }
Blockly.Words["google-spreadsheet_write_on-sheetName"] = { en: "on sheet", de: "auf Tabellenblatt" }
Blockly.Words["google-spreadsheet_write_on-range"] = { en: "in cell", de: "in Zelle" }
Blockly.Words["google-spreadsheet_write_data"] = { en: "the data", de: "die Daten" }
Blockly.Words["google-spreadsheet_write_add-to-suffix"] = { en: "", de: "hinzu" }

Blockly.Sendto.blocks["google-spreadsheet.write"] =
    '<block type="google-spreadsheet.write">' +
    '     <value name="NAME">' +
    '     </value>' + 
    '     <value name="INSTANCE">' +
    '     </value>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="RANGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <value name="DATA">' +
    '     </value>' +
    '</block>';

    Blockly.Blocks["google-spreadsheet.write"] = {
        init: function () {
            const instances = getInstances();
    
            this.appendDummyInput("NAME")
                .appendField(Blockly.Translate("google-spreadsheet_write_write-to"))
                .appendField(new Blockly.FieldDropdown(instances), "INSTANCE");
    
                this.appendValueInput("SHEET_NAME")
                .appendField(Blockly.Translate("google-spreadsheet_write_on-sheetName"));
    
                this.appendValueInput("RANGE")
                .appendField(Blockly.Translate("google-spreadsheet_write_in-cell"));
    
            this.appendValueInput("DATA")
                .appendField(Blockly.Translate("google-spreadsheet_write_data"));
    
            this.appendDummyInput()
                .appendField(Blockly.Translate("google-spreadsheet_write_add-to-suffix"));
    
            this.setInputsInline(false);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
    
            this.setColour(Blockly.Sendto.HUE);

        },
    };
    
    Blockly.JavaScript["google-spreadsheet.write"] = function (block) {
        var dropdown_instance = block.getFieldValue("INSTANCE");
        var data = Blockly.JavaScript.valueToCode(block, "DATA", Blockly.JavaScript.ORDER_ATOMIC);
        if (!data){
            data = "{}";
        }
        var sheetName = Blockly.JavaScript.valueToCode(block, "SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);
        var range = Blockly.JavaScript.valueToCode(block, "RANGE", Blockly.JavaScript.ORDER_ATOMIC);
    
        return 'sendTo("google-spreadsheet' + dropdown_instance + '", "write", {"sheetName":'+sheetName+', "range":'+range+', "data":' + data + "});\n";
    };

