var transactions = require('./scripts/manager/transaction'),
  moment = require('moment');

$(document).ready(function() {
  console.log('Searching txs...');

  printTxTable();
});

function printTxTable() {
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
  });
}
