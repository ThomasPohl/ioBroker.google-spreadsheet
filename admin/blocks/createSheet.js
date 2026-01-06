'use strict';
/*global Blockly */
/*global getInstances */
/*global getInstanceAndAlias */

/// ---Create sheet  --------------------------------------------------
Blockly.Words['google-spreadsheet_create-sheet_catch'] = { en: 'on error', de: 'bei Fehler' };
Blockly.Words['google-spreadsheet_create-sheet_then'] = { en: 'then', de: 'dann' };
Blockly.Words['google-spreadsheet_create-sheet_create-in'] = { en: 'create in', de: 'erstelle in' };
Blockly.Words['google-spreadsheet_create-sheet_sheet-name'] = {
    en: 'a sheet with name',
    de: 'ein Blatt mit dem Namen',
};
Blockly.Words['google-spreadsheet_create-sheet_mutator-container'] = { en: 'createSheet', de: 'createSheet' };

Blockly.GoogleSheets.blocks['google-spreadsheet.createSheet'] =
    '<block type="google-spreadsheet.createSheet">' +
    '     <field name="INSTANCE"></field>' +
    '     <value name="SHEET_NAME">' +
    '         <shadow type="text">' +
    '             <field name="TEXT">text</field>' +
    '         </shadow>' +
    '     </value>' +
    '     <statement name="DO">' +
    '     </statement>' +
    '</block>';

Blockly.Blocks['google-spreadsheet.createSheet'] = {
    // Mutator für Error-Handling (nur ein Catch möglich)
    mutator: 'createSheet_mutator',
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
        this.setMutator(new Blockly.icons.MutatorIcon(['createSheet_mutator_catch'], this));

        const instances = getInstances();

        this.appendDummyInput('INSTANCE')
            .appendField(Blockly.Translate('google-spreadsheet_create-sheet_create-in'))
            .appendField(new Blockly.FieldDropdown(instances), 'INSTANCE');

        this.appendValueInput('SHEET_NAME').appendField(
            Blockly.Translate('google-spreadsheet_create-sheet_sheet-name'),
        );

        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);

        this.appendStatementInput('DO').appendField(Blockly.Translate('google-spreadsheet_create-sheet_then'));

        this.hasCatch_ = false;
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_tooltip'));
        this.setHelpUrl(Blockly.Translate('google-spreadsheet_help'));
    },
    updateShape_: function () {
        if (this.hasCatch_ && !this.getInput('CATCH')) {
            this.appendStatementInput('CATCH').appendField(Blockly.Translate('google-spreadsheet_create-sheet_catch'));
        } else if (!this.hasCatch_ && this.getInput('CATCH')) {
            this.removeInput('CATCH');
        }
    },
    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('createSheet_mutator_container');
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
        // Nur ein Catch-Block möglich
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        this.hasCatch_ = !!itemBlock;
        this.updateShape_();
    },
    saveConnections: function (containerBlock) {
        // Nur ein Catch-Block möglich
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        if (itemBlock) {
            let input = this.getInput('CATCH');
            itemBlock.valueConnection_ = input?.connection.targetConnection;
        }
    },
};

// Mutator-Container-Block for Drag & Drop error handling
Blockly.Blocks['createSheet_mutator_container'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Translate('google-spreadsheet_create-sheet_mutator-container'));
        this.appendStatementInput('STACK');
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_create-sheet_mutator-container'));
        this.contextMenu = false;
    },
};

// Mutator-Block for error handling
Blockly.Blocks['createSheet_mutator_catch'] = {
    init: function () {
        this.appendDummyInput('CATCH')
            .appendField(Blockly.Translate('google-spreadsheet_create-sheet_catch'));
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(Blockly.GoogleSheets.HUE);
        this.setTooltip(Blockly.Translate('google-spreadsheet_create-sheet_catch'));
        this.contextMenu = false;
    },
};

Blockly.JavaScript.forBlock['google-spreadsheet.createSheet'] = function (block) {
    const { instance, alias } = getInstanceAndAlias(block);
    let sheetName = Blockly.JavaScript.valueToCode(block, 'SHEET_NAME', Blockly.JavaScript.ORDER_ATOMIC);
    sheetName = sheetName.replace(/^['"]|['"]$/g, '');
    const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
    // Generate error and success statements
    let catchCode = '';
    if (block.getInput('CATCH')) {
        catchCode = Blockly.JavaScript.statementToCode(block, 'CATCH');
    }
    let code = `sendTo("google-spreadsheet${instance}", "createSheet", {sheet: "${sheetName}", alias: "${alias}"}, function (res) {\n`;
    code += `  if (res && res.error) {\n${catchCode}  } else {\n${statements_do}  }\n`;
    code += '});\n';
    return code;
};
