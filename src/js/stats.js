var transactions = require('./scripts/manager/transaction');

$(document).ready(function() {
  console.log('Searching stats...');

  printStatsTable();
});

function printStatsTable() {
  transactions.groupByType(function(err, stats) {
    if (err) return console.error(err);

    var $tr;
    var $rows = $('#stats_rows');

    $rows.empty();
    if (stats) {
      for (var statsType in stats) {
        $tr = $('<tr>');
        $tr.append($('<td>' + statsType + '</td>'));
        $tr.append($('<td>' + stats[statsType].sum + '</td>'));
        $rows.append($tr);
      }
    }
  });
}
