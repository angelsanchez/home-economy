var mongoose = require('mongoose'),
  cfg = require('../../config/app.json'),
  Transaction = require('./model/transaction'),
  conn;

module.exports = {

  connect: function(next) {
    console.log('connecting to: %s', cfg.db.conn);
    conn = mongoose.connect(cfg.db.conn, next);
  },
  drop: function(next) {
    console.log('dropping database');
    mongoose.connection.db.dropDatabase(next);
  },
  close: function() {
    console.log('closing connection');
    conn.disconnect();
  },
  insertTx: function(row, callback) {
    var tx = new Transaction(row);
    tx.save(callback);
  }

};
