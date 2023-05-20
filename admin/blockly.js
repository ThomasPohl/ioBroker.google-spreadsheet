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
Blockly.Words["google-spreadsheet_message"] = { en: "message", de: "Meldung" };


Blockly.Words["google-spreadsheet_anyInstance"] = { en: "all instances", de: "Alle Instanzen" };
Blockly.Words["google-spreadsheet_tooltip"] = {
    en: "Append data to a google spreadsheet",
    de: "Daten an eine Google Tabelle anhängen",
};
Blockly.Words["google-spreadsheet_help"] = {
    en: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
    de: "https://github.com/ThomasPohl/ioBroker.google-spreadsheet/blob/master/README.md",
};

Blockly.Sendto.blocks["google-spreadsheet"] =
    '<block type="google-spreadsheet">' +
    '     <value name="INSTANCE">' +
    "     </value>" +
    '     <value name="MESSAGE">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    "         </shadow>" +
    "     </value>" +
    "</block>";

Blockly.Blocks["google-spreadsheet"] = {
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

        this.appendDummyInput("INSTANCE")
            .appendField(Blockly.Translate("google-spreadsheet"))
            .appendField(new Blockly.FieldDropdown(options), "INSTANCE");

        this.appendValueInput("MESSAGE").appendField(Blockly.Translate("google-spreadsheet_message"));

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

Blockly.JavaScript["google-spreadsheet"] = function (block) {
    var dropdown_instance = block.getFieldValue("INSTANCE");
    var message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC);
    var text = message;
    var logText;

    return 'sendTo("google-spreadsheet' + dropdown_instance + '", "send", ' + text + ");\n";
};