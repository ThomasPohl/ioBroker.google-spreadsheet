# Clear Range

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The clear range feature clears all values in a rectangular cell area.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/clear

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `range`: The A1 range, for example `A1:C10`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Javascript

```javascript
sendTo(
  'google-spreadsheet.0',
  'clearRange',
  { sheet: 'Sheet1', range: 'A1:B10', alias: 'main' },
  response => {
    console.log(response);
  },
);
```
