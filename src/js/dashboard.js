var transactions = require('./scripts/manager/transaction'),
  moment = require('moment'),
  async = require('async'),
  db = require('./scripts/db.js');

$(document).ready(function() {
  console.log('Searching txs...');

  // TODO manage better the db connection (only one connection?)
  async.series({
    connect: db.connect,
    process: printTxTable
  }, function(err) {
    if (err) console.error(err);
    // close db connection in all cases
    db.close();
  });
});

function printTxTable(done) {
  transactions.find(function(err, txs) {
    if (err) return console.error(err);

    var $tr, $rows = $('#transaction_rows');

    $rows.empty();
    if (txs) {
      txs.forEach(function(tx) {
        $tr = $('<tr>');
        $tr.append($('<td>' + moment(tx.date).format('YY-MM-DD') + '</td>'));
        $tr.append($('<td>' + tx.type + '</td>'));
        $tr.append($('<td>' + tx.ds + '</td>'));
        $rows.append($tr);
      });
    }
    done();
  });
}
