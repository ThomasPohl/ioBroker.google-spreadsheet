# Delete Rows

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.

The delete-rows feature allows you to delete specific rows from a Google spreadsheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate


The feature accepts the following parameters:
- `sheetName`: The name of the sheet from which rows are to be deleted.
- `start`: The index of the first row to delete (0-based).
- `end`: The index of the last row to delete (exclusive, 0-based).

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Blockly

![Blockly](../img/blockly-delete-rows.png)

In Blockly, the parameters `sheetName`, `start`, and `end` are passed to the Google API.

## Javascript

The given code snippet deletes rows from the spreadsheet within the specified range of rows.

```javascript
sendTo(
  "google-spreadsheet", 
  "deleteRows", {  
    "sheetName": "yourSheetName",
    "start": startRow,
    "end": endRow
  }
);