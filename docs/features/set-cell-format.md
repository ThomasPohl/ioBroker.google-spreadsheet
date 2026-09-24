# Set Cell Format

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The set cell format feature applies formatting to a cell range.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `range`: The A1 range, for example `A1:B5`.
- `format`: Formatting options such as `backgroundColor`, `textFormat`, `horizontalAlignment`, `verticalAlignment`, and `numberFormat`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Javascript

### 1) Highlight a header row

This example colors the first row in a table, bolds the text and centers it.

```javascript
sendTo(
  'google-spreadsheet.0',
  'setCellFormat',
  {
    sheet: 'Sheet1',
    range: 'A1:F1',
    format: {
      backgroundColor: '#1f4e78',
      textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
      horizontalAlignment: 'CENTER',
      verticalAlignment: 'MIDDLE',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```

### 2) Mark overdue values in red

Use this for a status or KPI table, for example to highlight negative values or missing values.

```javascript
sendTo(
  'google-spreadsheet.0',
  'setCellFormat',
  {
    sheet: 'Sheet1',
    range: 'B2:B30',
    format: {
      backgroundColor: { red: 1, green: 0.8, blue: 0.8 },
      textFormat: { bold: true, italic: false },
      horizontalAlignment: 'LEFT',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```

### 3) Set a number format for a value range

This is useful for currency, percentages or timestamps.

```javascript
sendTo(
  'google-spreadsheet.0',
  'setCellFormat',
  {
    sheet: 'Sheet1',
    range: 'C2:C100',
    format: {
      numberFormat: {
        type: 'CURRENCY',
        pattern: '€#,##0.00',
      },
      horizontalAlignment: 'RIGHT',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```

### 4) Format a single cell with custom background

Use a single cell range when you want to emphasize a specific result.

```javascript
sendTo(
  'google-spreadsheet.0',
  'setCellFormat',
  {
    sheet: 'Sheet1',
    range: 'E5',
    format: {
      backgroundColor: '#d9ead3',
      textFormat: { bold: true },
      horizontalAlignment: 'CENTER',
      verticalAlignment: 'MIDDLE',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```

### 5) Apply the same styling to multiple sections

You can keep the range as a block, such as a whole table area, and only vary the style object.

```javascript
sendTo(
  'google-spreadsheet.0',
  'setCellFormat',
  {
    sheet: 'Dashboard',
    range: 'A2:D20',
    format: {
      backgroundColor: { red: 0.94, green: 0.97, blue: 1 },
      horizontalAlignment: 'CENTER',
      verticalAlignment: 'MIDDLE',
    },
    alias: 'dashboard',
  },
  response => {
    console.log(response);
  },
);
```

## Notes

- `backgroundColor` can be provided as a hex string such as `'#ff0000'` or as an object with `red`, `green`, `blue`, and optional `alpha` values.
- `textFormat` supports fields such as `bold`, `italic`, `foregroundColor`, and similar Google Sheets text properties.
- `numberFormat` can be used for currencies, percentages, dates or custom display formats.
- If no valid formatting property is supplied, the call fails with an error such as `No valid format properties provided`.
