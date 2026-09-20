# Get Last Row

See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.

The get-last-row feature returns the number of the last non-empty row in a Google Sheets sheet. It only determines the row number; reading the values from that row is a separate operation.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get

The feature accepts the following parameters:

- `sheet`: The name of the sheet.
- `alias` (optional): The spreadsheet alias when multiple spreadsheets are configured.

**Callback result:** The row number as a number. An empty sheet returns `0`. On failure, the callback receives `{ error: string }`.

## Blockly

The Blockly block returns the last non-empty row number as a numeric value. It can be used as input for other blocks, for example to build a range for a later read operation.

## JavaScript

The following example reads the number of the last non-empty row:

```javascript
sendTo(
  'google-spreadsheet.0',
  'getLastRow',
  { sheet: 'Sheet1' },
  (response) => console.log('Last row:', response),
);
```