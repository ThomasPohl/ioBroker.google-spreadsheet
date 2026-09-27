# Write Range

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The write range feature writes a rectangular data block to a Google Sheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `range`: The A1 range, for example `A1:B10`.
- `values`: A 2D array such as `[['a', 'b'], ['c', 'd']]`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Javascript

```javascript
sendTo(
  'google-spreadsheet.0',
  'writeRange',
  {
    sheet: 'Sheet1',
    range: 'A1:B2',
    values: [['Temperature', 'Humidity'], ['21', '45']],
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```
