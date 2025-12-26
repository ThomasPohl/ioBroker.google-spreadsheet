# Delete multiple sheets

With the `deleteSheets` block you can delete several sheets from your Google Spreadsheet at once.

## Blockly

![Blockly](../img/blockly-delete-sheets.png)

Use the block **delete sheets in [instance] the sheets with names (array)** and provide an array of sheet names, e.g. `["Sheet1", "Sheet2"]`.

## JavaScript

You can also call the function directly:

```javascript
sendTo("google-spreadsheet.0", "deleteSheets", ["Sheet1", "Sheet2"]);
```

## Parameters

- **instance**: The instance of your google-spreadsheet adapter.
- **sheet names (array)**: An array of strings with the names of the sheets to delete.

## Example

```javascript
sendTo("google-spreadsheet.0", "deleteSheets", ["Log", "Backup"]);
```

This will delete the sheets named "Log" and "Backup" from your spreadsheet.

