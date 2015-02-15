var XLSX = require('xlsx'),
  path = require('path'),
  fs = require('fs'),
  async = require('async'),
  colMap;

// relation between xlsx column names and the returned row property names
colMap = {
  B: 'date', // TODO opDate better name?
  D: 'valDate',
  F: 'description',
  H: 'amount',
  J: 'balance'
};

module.exports = {
  fileExtension: '*.xlsx',
  mapLines: function(file, lineIterator, callback) {
    console.log('processing file[' + file + ']...');

    var workbook = XLSX.readFile(file),
      txs = [],
      newRow,
      tx,
      fieldName,
      row, rowName, rowVal,
      matches,
      col;

    workbook.SheetNames.forEach(function(sheetName) {
      var worksheet = workbook.Sheets[sheetName];
      for (rowName in worksheet) {
        // skip inherit properties
        if (!worksheet.hasOwnProperty(rowName)) continue;

        // rowName is like 'B16'
        if (rowName[0] === '!') continue; // skip "!ref"

        matches = /([A-Z]+)(\d+)/.exec(rowName);
        col = matches[1];
        row = matches[2];

        const FIRST_ROW_IDX = 12;
        if (row < FIRST_ROW_IDX) continue;

        newRow = row - FIRST_ROW_IDX;
        tx = txs[newRow];
        if (!tx) {
          tx = txs[newRow] = {};
        }
        fieldName = colMap[col];
        if (fieldName) {
          rowVal = worksheet[rowName].v;
          tx[fieldName] = rowVal;
        }
      }
    });

    async.forEach(txs, function(tx, next) {
      lineIterator(tx, next);
    }, callback);
  }
};
