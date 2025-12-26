# Write multiple cells

With the `writeCells` block you can write values to multiple cells in your Google Spreadsheet at once.

## Blockly

![Blockly](../img/blockly-write-cells.png)

Use the block **write cells to [instance] cells** and add one or more cell blocks.  
Each cell block lets you specify:
- **Sheet**: The name of the sheet
- **Cell**: The cell address (e.g. `A1`)
- **Data**: The value to write

Example Blockly setup:
- write cells to `google-spreadsheet.0`
  - Sheet: `Log`, Cell: `A1`, Data: `Hello`
  - Sheet: `Log`, Cell: `B1`, Data: `World`

## JavaScript

You can also call the function directly:

```javascript
sendTo("google-spreadsheet.0", "writeCells", {
    cells: [
        { sheetName: "Log", cell: "A1", data: "Hello" },
        { sheetName: "Log", cell: "B1", data: "World" }
    ]
});
```

## Parameters

- **instance**: The instance of your google-spreadsheet adapter.
- **cells**: Array of objects with the following properties:
  - **sheetName**: Name of the sheet
  - **cell**: Cell address (e.g. `A1`)
  - **data**: Value to write

## Example

```javascript
sendTo("google-spreadsheet.0", "writeCells", {
    cells: [
        { sheetName: "Log", cell: "A1", data: "Temperature" },
        { sheetName: "Log", cell: "B1", data: 22.5 }
    ]
});
```

This will write "Temperature" to cell A1 and 22.5 to cell B1 in the sheet "Log".
