# Update Chart

➡️ See the [sendTo API documentation](../sendTo-API.md) for general usage and all available commands.
The update chart feature updates the data range or styling of an existing chart.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate

The feature accepts the following parameters:
- `sheet`: The name of the sheet.
- `chartId`: The chart ID to update.
- `chart`: A chart configuration object with `title`, `chartType`, `range`, and optional `position`.
- `alias` (optional): The spreadsheet alias if you have multiple spreadsheets configured.

**Callback result:** `{ success: true }` on success, or `{ error: string }` on failure.

## Javascript

```javascript
sendTo(
  'google-spreadsheet.0',
  'updateChart',
  {
    sheet: 'Sheet1',
    chartId: 0,
    chart: {
      title: 'Monthly Temperature',
      chartType: 'bar',
      range: 'A1:B12',
      xAxis: 'Month',
      yAxis: '°C',
    },
    alias: 'main',
  },
  response => {
    console.log(response);
  },
);
```
