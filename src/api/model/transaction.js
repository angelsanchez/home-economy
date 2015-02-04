var mongoose = require('mongoose'),
  transactionSchema,
  Transaction;

transactionSchema = mongoose.Schema({
  opDate: Date,
  valDate: Date,
  ds: String,
  type: String,
  company: {type: String, optional: true},
  creditCard: {type: String, optional: true},
  purchaseDate: {type: Date, optional: true},
  concept: {type: String, optional: true},
  from: {type: String, optional: true},
  fee: {type: Number, optional: true},
  atmDate: {type: Date, optional: true},
  balance: Number,
  amount: Number

}, {versionKey: false});

Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
