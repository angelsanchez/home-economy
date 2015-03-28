var csv = require('csv-stream');
var fs = require('fs');
var es = require('event-stream');

var cvsStreamOptions = {
  // default is ,
  delimiter: ',',

  // default is \n,
  endLine: '\n',

  // by default read the first line and use values found as columns
  columns: ['date', 'description', 'amount', 'balance'],

  // default is an empty string
  escapeChar: '"',

  // default is an empty string
  enclosedChar: '\''
};
var SKIP_ROWS = 4;

module.exports = {
  fileExtension: '*.csv',
  mapLines: function(file, lineIterator, callback) {
    var row = 1;
    var csvStream = csv.createStream(cvsStreamOptions);
    var stream = fs.createReadStream(file);

    stream.pipe(csvStream)
      .on('error', function(err) {
        console.error(err);
      })
      .pipe(es.map(function(line, cb) {
        if (row++ <= SKIP_ROWS) {
          return cb();
        }

        lineIterator(line, cb);

      }))
      .on('close', callback);

  }
};
