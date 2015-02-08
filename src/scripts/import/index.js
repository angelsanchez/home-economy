var async = require('async'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  path = require('path'),
  analyzer = require('./analyzer'),
  reader = require('./reader'),
  Transaction = require('../../api/model/transaction'),
  conn, stats;

stats = {
  files: 0,
  transactions: 0,
  errors: []
};

module.exports = {

  run: function(opts, processCallback) {

    var type = opts.type,
      recursive = opts.recursive,
      paths = path.resolve(opts.path) + (recursive ? '/**/' : '/') + '*.csv';

    processCallback = (processCallback || endImport);

    async.series({
      connect: function(next) {
        console.log('connecting to mongo');
        conn = mongoose.connect('mongodb://localhost:27017/home_economy', next);
      },
      drop: function(next) {
        if (!opts.truncate) {
          return next();
        }
        console.log('dropping database');
        mongoose.connection.db.dropDatabase(next);
      },
      process: function(next) {
        console.log('starting import for %s in %s', type, paths);

        importFiles(type, paths, next);

      },
      close: function(next) {
        console.log('closing connection');
        conn.disconnect();
        next();
      }
    }, function(err) {

      processCallback(err, stats);

    });
  }
};

function importFiles(type, path, filesCallback) {

  glob(path, function(err, files) {
    if (err) throw err;

    async.map(_.flatten(files), function(file, fileCallback) {

      var typeAnalyzer = analyzer.create(type);
      var typeReader = reader.create(type);

      console.log('importing file %s', file);

      stats.files += 1;

      typeReader.mapLines(file, function(row, cb) {

        insertTransaction(typeAnalyzer.analyze(row), function(err, res) {
          if (err) {
            stats.errors.push(err);
          } else {
            stats.transactions += 1;
          }
          cb(err);
        });

      }, fileCallback);

    }, filesCallback);

  });

}

function insertTransaction(row, callback) {
  if (!row.type) {
    return callback(new Error('row without type'));
  }
  tx = new Transaction(row);
  tx.save(callback);
}

function endImport(err, stats) {
  if (err) {
    console.log(err);
  }

  if (stats.errors.length) {
    console.log(stats.errors);
  }

  console.log('process complete');
  console.log('files: %s  txs: %s errs: %s', stats.files, stats.transactions, stats.errors.length);
}
