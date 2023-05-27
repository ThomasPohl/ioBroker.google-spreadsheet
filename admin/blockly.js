"use strict";

//console.error("Blockly gotify");

if (typeof goog !== "undefined") {
    goog.provide("Blockly.JavaScript.Sendto");

    goog.require("Blockly.JavaScript");
}

// remove it somewhere, because it defined in javascript=>blocks_words.js from javascript>=4.6.0
Blockly.Translate =
    Blockly.Translate ||
    function (word, lang) {
        lang = lang || systemLang;
        if (Blockly.Words && Blockly.Words[word]) {
            return Blockly.Words[word][lang] || Blockly.Words[word].en;
        } else {
            return word;
        }
    };

/// --- SendTo gotify --------------------------------------------------
Blockly.Words["google-spreadsheet"] = { en: "Google Spreadsheet", de: "Google Tabelle" };
Blockly.Words["google-spreadsheet_instance"] = { en: "instance", de: "Instanz" };
Blockly.Words["google-spreadsheet_append"] = { en: "append to Google Spreadsheet", de: "An Google Tabelle anhängen" };
Blockly.Words["google-spreadsheet_createSheet"] = { en: "create a new sheet in Google Spreadsheet", de: "Neues sheet" };
Blockly.Words["google-spreadsheet_deleteSheet"] = { en: "delete a sheet in Google Spreadsheet", de: "Sheet löschen" };
Blockly.Words["google-spreadsheet_data"] = { en: "data", de: "Daten" };
Blockly.Words["google-spreadsheet_deleteRows"] = { en: "delete rows from Google Spreadsheet", de: "Zeilen aus Google Tabelle löschen" };
Blockly.Words["google-spreadsheet_startRow"] = { en: "from row", de: "ab Zeile" };
Blockly.Words["google-spreadsheet_endRow"] = { en: "to row", de: "bis Zeile" };
Blockly.Words["google-spreadsheet_sheetName"] = { en: "sheet name", de: "Tab Name" };


Blockly.Words["google-spreadsheet_anyInstance"] = { en: "all instances", de: "Alle Instanzen" };
Blockly.Words["google-spreadsheet_tooltip"] = {
    en: "Append data to a google spreadsheet",
    de: "Daten an eine Google Tabelle anhängen",
};
Blockly.Words["google-spreadsheet_help"] = {
    en: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
    de: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
};

Blockly.Sendto.blocks["google-spreadsheet.append"] =
    '<block type="google-spreadsheet.append">' +
    '     <value name="NAME">' +
    "     </value>" + 
    '     <value name="INSTANCE">' +
    "     </value>" +
    '     <value name="SHEET_NAME">' +
    "     </value>" +
    '     <value name="DATA">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    "         </shadow>" +
    "     </value>" +
    "</block>";

    Blockly.Sendto.blocks["google-spreadsheet.deleteRows"] =
        '<block type="google-spreadsheet.deleteRows">' +
        '     <value name="NAME">' +
        "     </value>" + 
        '     <value name="INSTANCE">' +
        "     </value>" +
        '     <value name="SHEET_NAME">' +
        "     </value>" +
        '     <value name="START_ROW">' +
        '         <shadow type="math_number">' +
        '             <field name="NUM1">1</field>' +
        "         </shadow>" +
        "     </value>" +
        '     <value name="END_ROW">' +
        '         <shadow type="math_number">' +
        '             <field name="NUM2">2</field>' +
        "         </shadow>" +
        "     </value>" +     
        "</block>";

    Blockly.Sendto.blocks["google-spreadsheet.createSheet"] =
    '<block type="google-spreadsheet.createSheet">' +
    '     <value name="NAME">' +
    "     </value>" + 
    '     <value name="INSTANCE">' +
    "     </value>" +
    '     <value name="SHEET_NAME">' +
    "     </value>" +
    "</block>";

    Blockly.Sendto.blocks["google-spreadsheet.deleteSheet"] =
        '<block type="google-spreadsheet.deleteSheet">' +
        '     <value name="NAME">' +
        "     </value>" + 
        '     <value name="INSTANCE">' +
        "     </value>" +
        '     <value name="SHEET_NAME">' +
        "     </value>" +
        "</block>";

Blockly.Blocks["google-spreadsheet.append"] = {
    init: function () {
        var options = [[Blockly.Translate("google-spreadsheet_anyInstance"), ""]];
        if (typeof main !== "undefined" && main.instances) {
            for (var i = 0; i < main.instances.length; i++) {
                var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
                if (m) {
                    var n = parseInt(m[1], 10);
                    options.push(["google-spreadsheet." + n, "." + n]);
                }
            }
        }

        if (!options.length) {
            for (var u = 0; u <= 4; u++) {
                options.push(["google-spreadsheet." + u, "." + u]);
            }
        }

        this.appendDummyInput("NAME")
            .appendField(Blockly.Translate("google-spreadsheet_append"));

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_instance"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("SHEET_NAME").appendField(Blockly.Translate("google-spreadsheet_sheetName"));

        this.appendValueInput("DATA").appendField(Blockly.Translate("google-spreadsheet_data"));

       /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("google-spreadsheet_tooltip"));
        this.setHelpUrl(Blockly.Translate("google-spreadsheet_help"));
    },
};

Blockly.JavaScript["google-spreadsheet.append"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var data = Blockly.JavaScript.valueToCode(block, "DATA", Blockly.JavaScript.ORDER_ATOMIC);
    var sheetName = Blockly.JavaScript.valueToCode(block, "SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);

    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "append", {"sheetName":'+sheetName+', "data":' + data + "});\n";
};


Blockly.Blocks["google-spreadsheet.deleteRows"] = {
    init: function () {
        var options = [[Blockly.Translate("google-spreadsheet_anyInstance"), ""]];
        if (typeof main !== "undefined" && main.instances) {
            for (var i = 0; i < main.instances.length; i++) {
                var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
                if (m) {
                    var n = parseInt(m[1], 10);
                    options.push(["google-spreadsheet." + n, "." + n]);
                }
            }
        }

        if (!options.length) {
            for (var u = 0; u <= 4; u++) {
                options.push(["google-spreadsheet." + u, "." + u]);
            }
        }

        this.appendDummyInput("NAME")
            .appendField(Blockly.Translate("google-spreadsheet_deleteRows"));

            this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_instance"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

            this.appendValueInput("SHEET_NAME").appendField(Blockly.Translate("google-spreadsheet_sheetName"));

            this.appendValueInput("START_ROW").appendField(Blockly.Translate("google-spreadsheet_startRow"));

            this.appendValueInput("END_ROW").appendField(Blockly.Translate("google-spreadsheet_endRow"));

            /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("google-spreadsheet_tooltip"));
        this.setHelpUrl(Blockly.Translate("google-spreadsheet_help"));
    },
};

Blockly.JavaScript["google-spreadsheet.deleteRows"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var startRow = Blockly.JavaScript.valueToCode(block, "START_ROW", Blockly.JavaScript.ORDER_ATOMIC);
    var endRow = Blockly.JavaScript.valueToCode(block, "END_ROW", Blockly.JavaScript.ORDER_ATOMIC);
    var sheetName = Blockly.JavaScript.valueToCode(block, "SHEET_NAME", Blockly.JavaScript.ORDER_ATOMIC);
    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "deleteRows", {"sheetName":'+sheetName+',"start":' + startRow + ', "end":' + endRow + "});\n";
};

Blockly.Blocks["google-spreadsheet.createSheet"] = {
    init: function () {
        var options = [[Blockly.Translate("google-spreadsheet_anyInstance"), ""]];
        if (typeof main !== "undefined" && main.instances) {
            for (var i = 0; i < main.instances.length; i++) {
                var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
                if (m) {
                    var n = parseInt(m[1], 10);
                    options.push(["google-spreadsheet." + n, "." + n]);
                }
            }
        }

        if (!options.length) {
            for (var u = 0; u <= 4; u++) {
                options.push(["google-spreadsheet." + u, "." + u]);
            }
        }

        this.appendDummyInput("NAME")
            .appendField(Blockly.Translate("google-spreadsheet_createSheet"));

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_instance"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("SHEET_NAME").appendField(Blockly.Translate("google-spreadsheet_sheetName"));

       /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

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
Blockly.Blocks["google-spreadsheet.deleteSheet"] = {
    init: function () {
        var options = [[Blockly.Translate("google-spreadsheet_anyInstance"), ""]];
        if (typeof main !== "undefined" && main.instances) {
            for (var i = 0; i < main.instances.length; i++) {
                var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
                if (m) {
                    var n = parseInt(m[1], 10);
                    options.push(["google-spreadsheet." + n, "." + n]);
                }
            }
        }

        if (!options.length) {
            for (var u = 0; u <= 4; u++) {
                options.push(["google-spreadsheet." + u, "." + u]);
            }
        }

        this.appendDummyInput("NAME")
            .appendField(Blockly.Translate("google-spreadsheet_deleteSheet"));

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet_instance"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("SHEETNAME").appendField(Blockly.Translate("google-spreadsheet_sheetName"));

       /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("google-spreadsheet_tooltip"));
        this.setHelpUrl(Blockly.Translate("google-spreadsheet_help"));
    },
};

Blockly.JavaScript["google-spreadsheet.deleteSheet"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var data = Blockly.JavaScript.valueToCode(block, "SHEETNAME", Blockly.JavaScript.ORDER_ATOMIC);

    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "deleteSheet", ' + data + ");\n";
};