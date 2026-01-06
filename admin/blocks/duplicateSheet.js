"use strict";
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

// Translations
Blockly.Words['google-spreadsheet_duplicate-sheet_duplicate-in'] = { en: 'duplicate in', de: 'dupliziere in' };
Blockly.Words['google-spreadsheet_duplicate-sheet_sheetName'] = { en: 'the sheet with the name', de: 'das Blatt mit dem Namen' };
Blockly.Words['google-spreadsheet_duplicate-sheet_newSheetName'] = { en: 'new name', de: 'neuer Name' };
Blockly.Words['google-spreadsheet_duplicate-sheet_newPosition'] = { en: 'at position', de: 'an Position' };
Blockly.Words['google-spreadsheet_duplicate-sheet_then'] = { en: 'then', de: 'then' };
Blockly.Words['google-spreadsheet_duplicate-sheet_catch'] = { en: 'on error', de: 'bei Fehler' };
Blockly.Words['google-spreadsheet_duplicate-sheet_mutator-container'] = { en: 'duplicateSheet', de: 'duplicateSheet' };

Blockly.GoogleSheets.blocks['google-spreadsheet.duplicateSheet'] =
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
    '     <statement name="DO"></statement>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.duplicateSheet'] = {
    mutator: 'duplicateSheet_mutator',
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('catch', this.hasCatch_ ? 1 : 0);
        return container;
    },
    domToMutation: function (xmlElement) {
        this.hasCatch_ = xmlElement.getAttribute('catch') == 1;
        this.updateShape_();
    },
    init: function () {
        this.setMutator(new Blockly.icons.MutatorIcon(['duplicateSheet_mutator_catch'], this));

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

        this.appendStatementInput('DO').appendField(Blockly.Translate('google-spreadsheet_duplicate-sheet_then'));

        this.hasCatch_ = false;
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
    updateShape_: function () {
        if (this.hasCatch_ && !this.getInput('CATCH')) {
            this.appendStatementInput('CATCH').appendField(Blockly.Translate('google-spreadsheet_duplicate-sheet_catch'));
        } else if (!this.hasCatch_ && this.getInput('CATCH')) {
            this.removeInput('CATCH');
        }
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('duplicateSheet_mutator_container');
        containerBlock.initSvg();
        let connection = containerBlock.getInput('STACK').connection;
        if (this.hasCatch_) {
            const catchBlock = workspace.newBlock('createSheet_mutator_catch');
            catchBlock.initSvg();
            connection.connect(catchBlock.previousConnection);
        }
        return containerBlock;
    },
    compose: function (containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        this.hasCatch_ = !!itemBlock;
        this.updateShape_();
    },
    saveConnections: function (containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        if (itemBlock) {
            let input = this.getInput('CATCH');
            itemBlock.valueConnection_ = input?.connection.targetConnection;
        }
    },
};

// Mutator container block
Blockly.Blocks['duplicateSheet_mutator_container'] = {
    init: function () {
        this.appendDummyInput().appendField(Blockly.Translate('google-spreadsheet_duplicate-sheet_mutator-container'));
        this.appendStatementInput('STACK');
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_duplicate-sheet_mutator-container'));
        this.contextMenu = false;
    },
};

// Mutator error block
Blockly.Blocks['duplicateSheet_mutator_catch'] = {
    init: function () {
        this.appendDummyInput('CATCH').appendField(Blockly.Translate('google-spreadsheet_duplicate-sheet_catch'));
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_duplicate-sheet_catch'));
        this.contextMenu = false;
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.duplicateSheet'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    let source = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let target = Blockly.JavaScript.valueToCode(block, 'NEW_SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let index = Blockly.JavaScript.valueToCode(block, 'NEW_POSITION', Blockly.JavaScript.ORDER_ATOMIC);
    if (!index) index = -1;
    const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    let catchCode = '';
    if (block.getInput('CATCH0')) {
        catchCode = Blockly.JavaScript.statementToCode(block, 'CATCH0');
    }
    let code = `sendTo("google-spreadsheet${instance}", "duplicateSheet", {source: ${source}, target: ${target}, index: ${index}, alias: "${alias}"}, function (res) {\n`;
    code += `  if (res && res.error) {\n${catchCode}  } else {\n${statements_do}  }\n`;
    code += '});\n';
    return code;
};
