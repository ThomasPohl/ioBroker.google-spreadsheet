# Create-Sheet

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The create-sheet feature allows you to add a new sheet to a Google spreadsheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate

The feature accepts the following parameters:
- `sheetName`: The name of the new sheet to be added.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Blockly

![Blockly](../img/blockly-create-sheet.png)

The Blockly block is a container block. The statements inside the block are only executed if the sheet is created successfully.

### Error Handling

You can add an error handler using the gear icon (mutator, drag & drop). Statements in the error handler are only executed if an error occurs while creating the sheet.

**Behavior:**
- **Without error handler:** The statements in the block are always executed, regardless of the result.
- **With error handler:**
  - The statements in the block are only executed on success.
  - The statements in the error handler are only executed on error.

The parameters `sheetName` and optional `alias` are passed as usual.

### Example

```javascript
sendTo(
  "google-spreadsheet.0",
  "createSheet",
  { sheetName: "nameOfNewSheet" },
  function (res) {
    if (res && res.error) {
      // Error handler code
    } else {
      // Success code
    }
  }
);
```

## Javascript

The given code snippet adds a new sheet to the spreadsheet with the specified title.

```javascript

sendTo(
  "google-spreadsheet.0",
  "createSheet",
  { sheetName: "nameOfNewSheet" }
);
```
