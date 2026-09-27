# Create Chart

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The create chart feature creates a chart from a data range in a sheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `chart`: A chart configuration object with `title`, `chartType`, `range`, and optional `position`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Javascript

```javascript
sendTo(
  'google-spreadsheet.0',
  'createChart',
  {
    sheet: 'Sheet1',
    chart: {
      title: 'Temperature',
      chartType: 'line',
      range: 'A1:B10',
      position: { row: 1, column: 4, width: 640, height: 360 },
      xAxis: 'Date',
      yAxis: '°C',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```
