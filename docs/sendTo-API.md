# sendTo API for ioBroker.google-spreadsheet

This document describes the `sendTo` API for the ioBroker adapter **google-spreadsheet**. The API uses the `command` parameter to distinguish between different spreadsheet operations. Each command expects a specific payload and returns a result via callback.

## Usage

```js
sendTo('google-spreadsheet.<instance>', <command>, <message>, callback);
```

- `<instance>`: The instance number of your adapter (e.g., `0`)
- `<command>`: One of the supported commands listed below
- `<message>`: An object with the required parameters for the command
- `callback`: Function to handle the result

## Supported Commands

| Command         | Description                                 | Required Parameters                | Result / Callback Response |
|-----------------|---------------------------------------------|-------------------------------------|---------------------------|
| `append`        | Append data to a sheet                      | `sheetName`, `data`, `alias?`      | `{ success: true }` on success, or `{ error: string }` on failure |
| `deleteRows`    | Delete rows from a sheet                    | `sheetName`, `start`, `end`, `alias?` | `{ success: true }` on success, or `{ error: string }` on failure |
| `createSheet`   | Create a new sheet                          | `sheetName`, `alias?`              | `{ success: true }` on success, or `{ error: string }` on failure |
| `deleteSheet`   | Delete a sheet                              | `sheetName`, `alias?`              | `{ success: true }` on success, or `{ error: string }` on failure |
| `deleteSheets`  | Delete multiple sheets                      | `sheetNames`, `alias?`             | `{ success: true }` on success, or `{ error: string }` on failure |
| `duplicateSheet`| Duplicate a sheet                           | `source`, `target`, `index`, `alias?` | `{ success: true }` on success, or `{ error: string }` on failure |
| `upload`        | Upload a file to Google Drive               | `target`, `parentFolder`, `source` | `{ success: true }` on success, or `{ error: string }` on failure |
| `writeCell`     | Write to a single cell                      | `sheetName`, `cell`, `data`, `alias?` | `{ success: true }` on success, or `{ error: string }` on failure |
| `writeCells`    | Write to multiple cells                     | `cells`, `alias?`                  | `{ success: true }` on success, or `{ error: string }` on failure |
| `readCell`      | Read a single cell                          | `sheetName`, `cell`, `alias?`      | `{ value: any }` with the cell value, or `{ error: string }` on failure |

### Result Details

- For most commands, the callback receives an object `{ success: true }` if the operation was successful, or `{ error: string }` if an error occurred.
- For `readCell`, the callback receives `{ value: any }` with the cell value, or `{ error: string }` if reading failed.

### Parameter Details
- `alias` is optional and refers to the spreadsheet alias if you have multiple spreadsheets configured.
- For `writeCells`, `cells` is an array of objects: `{ sheetName, cell, data }`.

## Example

```js
// Read a cell
sendTo('google-spreadsheet.0', 'readCell', { sheetName: 'Sheet1', cell: 'A1' }, (result) => {
    console.log('Cell value:', result);
});

// Write to a cell
sendTo('google-spreadsheet.0', 'writeCell', { sheetName: 'Sheet1', cell: 'A1', data: 'Hello' }, (result) => {
    console.log('Write result:', result);
});
```

## Feature Documentation

For detailed usage and examples of each command, see the following documents:

- [Append](features/append.md)
- [Create Sheet](features/create-sheet.md)
- [Delete Rows](features/delete-rows.md)
- [Delete Sheet](features/delete-sheet.md)
- [Delete Sheets](features/delete-sheets.md)
- [Duplicate Sheet](features/duplicate-sheet.md)
- [Read Cell](features/read-cell.md)
- [Write Cell](features/write-cell.md)
- [Write Cells](features/write-cells.md)

---

Back to [README.md](../README.md)
