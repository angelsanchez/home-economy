var async = require('async'),
  glob = require('glob'),
  _ = require('lodash'),
  path = require('path'),
  analyzer = require('./analyzer'),
  reader = require('./reader'),
  transactions = require('../manager/transaction'),
  stats;

module.exports = {

  run: function(opts, processCallback) {

    var type = opts.type,
      recursive = opts.recursive,
      paths = path.resolve(opts.path) + (recursive ? '/**/' : '/');

    processCallback = (processCallback || endImport);

    stats = {
      files: 0,
      transactions: 0,
      errors: []
    };

    async.series([
      function(next) {
        if (!opts.truncate) return next();
        transactions.drop(next);
      },

      function(next) {
        console.log('starting import for %s in %s', type, paths);
        importFiles(type, paths, next);
      }

    ], function(err) {
      processCallback(err, stats);
    });
  }
};

function importFiles(type, path, filesCallback) {

  var typeReader = reader.create(type),
    typeAnalyzer = analyzer.create(type);

  glob(path + typeReader.fileExtension, function(err, files) {
    if (err) throw err;

    async.map(_.flatten(files), function(file, fileCallback) {

      console.log('importing file %s', file);
      stats.files += 1;

      typeReader.mapLines(file, function(row, cb) {

        transactions.insertTx(typeAnalyzer.analyze(row), function(err) {
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
