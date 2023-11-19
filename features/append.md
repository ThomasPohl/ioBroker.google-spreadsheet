# Append
The append feature allows you to append data to a Google spreadsheet.

Used API endpoint: https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append

The feature accepts the data parameter as either a single value or a one-dimensional array.


## Blockly

![Blockly](../img/blockly-append.png)

In Blockly, the parameter sheetname is always passed as the range-parameter to the Google API. However, the range-parameter can accept not only a sheet name but also a cell in A1 notation. If you need to append data to a specific cell, you can specify the cell using the range-parameter. For instance, you can use 'Sheet1!A1:A1' to target a specific cell.

## Javascript

he given code snippet adds a new row to the spreadsheet. Each of the three array values will create a distinct cell in the spreadsheet.

```javascript

sendTo(
  "google-spreadsheet", 
  "append", {  
    "sheetName": "nameOfTab", 
    "data":[
      formatDate(new Date(), 'hh:mm'), 
      getState('mqtt.0.inverter.total.YieldDay').val, 
      getState('mqtt.0.inverter.total.P_AC').val
    ]
  }
);
```





