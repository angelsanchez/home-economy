var csv = require('csv-stream'),
  fs = require('fs'),
  es = require('event-stream');

var cvsStreamOptions = {
  delimiter: ',', // default is ,
  endLine: '\n', // default is \n,
  columns: ['date', 'description', 'amount', 'balance'], // by default read the first line and use values found as columns
  escapeChar: '"', // default is an empty string
  enclosedChar: '\'' // default is an empty string
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
