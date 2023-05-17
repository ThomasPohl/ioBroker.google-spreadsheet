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
Blockly.Words["googleSpreadsheet"] = { en: "Google Spreadsheet", de: "Google Tabelle" };
Blockly.Words["googleSpreadsheet_message"] = { en: "message", de: "Meldung" };


Blockly.Words["googleSpreadsheet_anyInstance"] = { en: "all instances", de: "Alle Instanzen" };
Blockly.Words["googleSpreadsheet_tooltip"] = {
    en: "Append data to a google spreadsheet",
    de: "Daten an eine Google Tabelle anhängen",
};
Blockly.Words["googleSpreadsheet_help"] = {
    en: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
    de: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
};

Blockly.Sendto.blocks["googleSpreadsheet"] =
    '<block type="googleSpreadsheet">' +
    '     <value name="INSTANCE">' +
    "     </value>" +
    '     <value name="MESSAGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    "         </shadow>" +
    "     </value>" +
    "</block>";

Blockly.Blocks["googleSpreadsheet"] = {
    init: function () {
        var options = [[Blockly.Translate("googleSpreadsheet_anyInstance"), ""]];
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

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("googleSpreadsheet"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("MESSAGE").appendField(Blockly.Translate("googleSpreadsheet_message"));

       /* if (input && input.connection) {
            input.connection._optional = true;
        }*/

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.setColour(Blockly.Sendto.HUE);
        this.setTooltip(Blockly.Translate("googleSpreadsheet_tooltip"));
        this.setHelpUrl(Blockly.Translate("googleSpreadsheet_help"));
    },
};

Blockly.JavaScript["googleSpreadsheet"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC);
    var text = "{\n";

    text += "   message: " + message + "\n";

    text += "}";
    var logText;

    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "send", ' + text + ");\n";
};