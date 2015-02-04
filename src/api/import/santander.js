var XLSX = require('xlsx'),
  path = require('path'),
  fs = require('fs'),
  Transaction = require('../model/transaction'),
  mongoose = require('mongoose'),
  transactions,
  colMap,
  conn;

module.exports = {
  importFrom: importFrom
};

colMap = {
  B: 'opDate',
  D: 'valDate',
  F: 'ds',
  H: 'amount',
  J: 'balance'
};

function importFrom(importFolder, callback) {
  var msg = '';

  transactions = [];

  fs.readdirSync(importFolder).forEach(function(filename) {
    if (filename.indexOf('.') !== 0) xlsxToTransactions(path.join(importFolder, filename));
  });

  msg += '\nConnection to Mongodb...';
  conn = mongoose.connect('mongodb://localhost/home_economy', function() {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) throw err;
      msg += '\nDB dropped';

      var total = transactions.length,
        result = [];

      msg += '\nSaving ' + transactions.length + ' transactions...';
      function saveAll(done) {

        var tx = new Transaction(transactions.pop());
        tx.save(function(err, saved) {
          if (err) throw err; // handle error

          result.push(saved);

          if (--total) saveAll(done);
          else {
            done();
          }
        });
      }

      saveAll(function() {
        msg += '\nDone.';
        conn.disconnect();
        callback(null, msg);
      });
    });
  });
}

function xlsxToTransactions(xlsxFile) {
  console.log('xlsx file[' + xlsxFile + ']');
  var workbook = XLSX.readFile(xlsxFile),
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

        // "Date" is a special suffix to parse dates
        if (/Date$/.test(fieldName)) {
          rowVal = parseDate(rowVal);
        }
        else if (fieldName === 'ds') {
          // add extra ds fields
          parseDs(tx, rowVal);
        }

        tx[fieldName] = rowVal;
      }
    }
  });

  transactions = transactions.concat(txs);
}

// utils

function parseDs(tx, rowVal) {
  const ATM_REGEX = /^DISPOSICION EN CAJERO CON LA TARJETA (.+), COMISION (.+), EL (\d\d\d\d-\d\d-\d\d)$/,
      BILL_REGEX = /^PAGO RECIBO DE (.+)(,| Nº)/,
      BILL_REGEX_2 = /^RECIBO (.+)(,| Nº)/,
      PURCHASE_REGEX = /^COMPRA EN (.+), CON LA TARJETA : (\d+) EL (\d\d\d\d-\d\d-\d\d)$/,
      TRANSFER_REGEX = /^TRANSFERENCIA DE (.+), CONCEPTO ?(.*)$/;

  var dsMatches;
  if (ATM_REGEX.test(rowVal)) {
    dsMatches = ATM_REGEX.exec(rowVal);
    tx.type = 'atm';
    tx.creditCard = dsMatches[1];
    tx.fee = Number(dsMatches[2].replace(',', '.'));
    tx.atmDate = new Date(dsMatches[3]);
  }
  else if (TRANSFER_REGEX.test(rowVal)) {
    dsMatches = TRANSFER_REGEX.exec(rowVal);
    tx.type = 'transfer';
    tx.from = dsMatches[1];
    tx.concept = dsMatches[2];
  }
  else if (BILL_REGEX.test(rowVal)) {
    dsMatches = BILL_REGEX.exec(rowVal);
    tx.type = 'bill';
    tx.company = dsMatches[1];
  }
  else if (BILL_REGEX_2.test(rowVal)) {
    dsMatches = BILL_REGEX_2.exec(rowVal);
    tx.type = 'bill';
    tx.company = dsMatches[1];
  }
  else if (PURCHASE_REGEX.test(rowVal)) {
    dsMatches = PURCHASE_REGEX.exec(rowVal);
    tx.type = 'purchase';
    tx.company = dsMatches[1];
    tx.creditCard = dsMatches[2];
    tx.purchaseDate = new Date(dsMatches[3]);
  }
  else {
    console.error('unknown format text[' + rowVal + ']');
  }
}

function parseDate(dateStr) {
  const DATE_REGEX = /^(\d+)\/(\d+)\/(\d+)$/;

  if (!DATE_REGEX.test(dateStr)) return 'invalid_date';

  var parsedDate, matches = DATE_REGEX.exec(dateStr);

  parsedDate = new Date();
  parsedDate.setDate(Number(matches[1]));
  parsedDate.setMonth(Number(matches[2] - 1));
  parsedDate.setFullYear(Number(matches[3]));
  parsedDate.setHours(0, 0, 0, 0);

  return parsedDate;
}
