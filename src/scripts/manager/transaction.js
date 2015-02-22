var Transaction = require('../model/transaction');

module.exports = {
  find: function(callback) {
    Transaction.find().exec(callback);
  }
};
