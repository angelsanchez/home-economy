var Datastore = require('nedb');
var path = require('path');
var dbFilename = path.join(window.require('nw.gui').App.dataPath, 'tx.db');
var db = new Datastore({filename: dbFilename, autoload: true});

console.log('dbFilename = %s', dbFilename);

module.exports = {
  find: function(callback) {
    db.find({}, callback);
  },

  insertTx: function(row, callback) {
    db.insert(row, callback);
  },

  drop: function(row, callback) {
    db.remove({}, {multi: true}, callback);
  },

  groupByType: function(callback) {
    db.find({}, {multi: true}, function(err, docs) {
      if (err) return callback(err);

      var result = {};
      docs.forEach(function(doc) {
        if (!result[doc.type]) result[doc.type] = {sum:0};
        result[doc.type].sum += doc.amount;
      });

      callback(null, result);
    });
  }
};
