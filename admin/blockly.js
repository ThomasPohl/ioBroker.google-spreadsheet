'use strict';

var goog = goog || undefined;
var Blockly = Blockly || undefined;

if (typeof goog !== 'undefined') {
    goog.provide('Blockly.JavaScript.Sendto');

    goog.require('Blockly.JavaScript');
}

Blockly.Words['google-spreadsheet_anyInstance'] = { en: 'all instances', de: 'allen Instanzen' };

function getInstances(withAny = true) {
    var options = [];
    if (withAny) {
        options.push([Blockly.Translate('google-spreadsheet_anyInstance'), '']);
    }
    if (typeof main !== 'undefined' && main.instances) {
        for (var i = 0; i < main.instances.length; i++) {
            var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
            if (m) {
                var n = parseInt(m[1], 10);
                options.push([`google-spreadsheet.${n}`, `.${n}`]);
            }
        }
    }

    if (!options.length) {
        for (var u = 0; u <= 4; u++) {
            options.push([`google-spreadsheet.${u}`, `.${u}`]);
        }
    }
    return options;
}

function loadJS(filename) {
    console.log(`Loading ${filename}`);
    const scriptTag = document.createElement('script');
    try {
        scriptTag.src = filename;

        document.body.appendChild(scriptTag);
    } catch (e) {
        console.error(`Cannot load ${filename}: ${e}`);
    }
}

loadJS('../google-spreadsheet/blocks/append.js');
loadJS('../google-spreadsheet/blocks/deleteRows.js');
loadJS('../google-spreadsheet/blocks/createSheet.js');
loadJS('../google-spreadsheet/blocks/deleteSheet.js');
loadJS('../google-spreadsheet/blocks/duplicateSheet.js');
loadJS('../google-spreadsheet/blocks/readCell.js');
loadJS('../google-spreadsheet/blocks/writeCell.js');
