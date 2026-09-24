# Read Range

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The read range feature reads a rectangular area from a Google Sheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `range`: The A1 range, for example `A1:B10`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ values: any[][] }` with the requested area, or `{ error: string }` on failure.

## Javascript

```javascript
sendTo(
  'google-spreadsheet.0',
  'readRange',
  { sheet: 'Sheet1', range: 'A1:B5', alias: 'main' },
  response => {
    console.log(response);
  },
);
```
