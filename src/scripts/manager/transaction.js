var Datastore = require('nedb'),
  path = require('path'),
  dbFilename = path.join(window.require('nw.gui').App.dataPath, 'tx.db'),
  db = new Datastore({filename: dbFilename, autoload: true});

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
  }
};
