var XLSX = require('xlsx');
var path = require('path');
var fs = require('fs');
var async = require('async');
var colMap;

// relation between xlsx column names and the returned row property names
colMap = {
  B: 'date',
  D: 'valDate',
  F: 'description',
  H: 'amount',
  J: 'balance'
};

module.exports = {
  fileExtension: '*.xlsx',
  mapLines: function(file, lineIterator, callback) {
    var workbook = XLSX.readFile(file);
    var txs = [];
    var newRow;
    var tx;
    var fieldName;
    var row;
    var rowName;
    var rowVal;
    var matches;
    var col;

    workbook.SheetNames.forEach(function(sheetName) {
      var worksheet = workbook.Sheets[sheetName];
      for (rowName in worksheet) {
        // skip inherit properties
        if (!worksheet.hasOwnProperty(rowName)) continue;

        // a rowName is like 'B16'

        // skip "!ref"
        if (rowName[0] === '!') continue;

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
