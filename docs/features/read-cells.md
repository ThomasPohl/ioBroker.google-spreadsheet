---
# Read Multiple Cells (`readCells`)

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The `readCells` feature allows you to read data from a range of cells in a Google spreadsheet using A1 notation (e.g. `A1:A7` or `A1:B10`).

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get

## Parameters

| Name    | Type    | Description                                             |
|---------|---------|--------------------------------------------------------|
| sheet   | string  | The name of the sheet                                   |
| range   | string  | The range in A1 notation, e.g. `A1:A7` or `A1:B10`     |
| alias   | string  | (optional) The spreadsheet alias if you use multiple    |

## Callback result

Returns a 2D array with the values from the specified range. Empty cells are returned as empty strings. On error, `{ error: string }` is returned.

**Example:**

```javascript
sendTo('google-spreadsheet.0', 'readCells', {
    sheet: 'Sheet1',
    range: 'A1:B10',
}, (result) => {
    console.log(result);
    // result is a 2D array with the values from the range
});
```

## Blockly

![Blockly](../img/blockly-read-cells.png)

A Blockly block for `readCells` is available. You can specify the sheet and the range in A1 notation.
