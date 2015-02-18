var tungus = require('tungus'),
  mongoose = require('mongoose'),
  Transaction = require('./model/transaction'),
  conn;

module.exports = {

  connect: function(next) {
    var connStr = 'tingodb://' + __dirname + '../../../data';
    console.log('connecting to: %s', connStr);
    conn = mongoose.connect(connStr, next);
  },
  drop: function(next) {
    console.log('dropping database');
    mongoose.connection.db.dropDatabase(next);
  },
  close: function() {
    console.log('closing connection');
    mongoose.disconnect();
  },
  insertTx: function(row, callback) {
    Transaction.create(row, callback);
  }

};
