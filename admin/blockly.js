'use strict';

/*global goog:true */
/*global Blockly:true */
/*global main:true */
/*global document:true */

if (typeof goog !== 'undefined') {
    goog.provide('Blockly.JavaScript.GoogleSheets');

    goog.require('Blockly.JavaScript');
}

Blockly.CustomBlocks = Blockly.CustomBlocks || [];
Blockly.CustomBlocks.push('GoogleSheets');

Blockly.GoogleSheets = {
    HUE: 'rgb(35, 166, 103)',
    blocks: {},
    WARNING_PARENTS: [
        'on_ext',
    ],
};
Blockly.Words['GoogleSheets'] = {'en':'Google Sheets','de': 'Google Sheets'};

Blockly.Words['google-spreadsheet_anyInstance'] = { en: 'default of all instances', de: 'default von allen Instanzen' };

/* eslint-disable @typescript-eslint/no-unused-vars */
function getInstances(withAny = true) {
    var options = [];
    if (withAny) {
        options.push([Blockly.Translate('google-spreadsheet_anyInstance'), '']);
    }
    if (typeof main !== 'undefined' && main.instances) {
        for (var i = 0; i < main.instances.length; i++) {
            var m = main.instances[i].match(/^system.adapter.google-spreadsheet.(\d+)$/);
            if (m) {
                const instanceName = main.instances[i];
                const n = parseInt(m[1], 10);
                const aliases = getSheetAliases(instanceName);
                if (aliases.length) {
                    for (const alias of aliases) {
                        options.push([`${alias} (google-spreadsheet.${n})`, `.${n}|${alias}`]);
                    }
                }
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

function getSheetAliases (instanceName) {
    const objects = window.main.objects;
    if (objects !== undefined && main !== undefined && main.instances !== undefined && objects[instanceName]!== undefined && Array.isArray(objects[instanceName].native.spreadsheets)) {
        const result = objects[instanceName].native.spreadsheets.map((sheet) => sheet.alias);
        if (result.length > 0) {
            return result;
        }
    }
    return [];
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function getInstanceAndAlias(block) {
    const dropdown_value = block.getFieldValue('INSTANCE');
    var dropdown_instance = '.0';
    var sheetAlias = 'default';
    if (dropdown_value.includes('|')) {
        const parts = dropdown_value.split('|');
        dropdown_instance = parts[0];
        sheetAlias = parts[1];
    } else {
        dropdown_instance = dropdown_value;
    }
    return { instance: dropdown_instance, alias: sheetAlias };
}

/* eslint-enable @typescript-eslint/no-unused-vars */

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
loadJS('../google-spreadsheet/blocks/deleteSheets.js');
loadJS('../google-spreadsheet/blocks/duplicateSheet.js');
loadJS('../google-spreadsheet/blocks/readCell.js');
loadJS('../google-spreadsheet/blocks/writeCell.js');
loadJS('../google-spreadsheet/blocks/writeCells.js');
