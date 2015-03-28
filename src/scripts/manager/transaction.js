var Datastore = require('nedb'),
  path = require('path'),
  db = new Datastore({filename: path.join(window.require('nw.gui').App.dataPath, 'something.db'), autoload: true});

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
