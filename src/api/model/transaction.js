var mongoose = require('mongoose'),
  transactionSchema,
  Transaction;

transactionSchema = mongoose.Schema({
  ds: String,
  type: String,
  amount: Number,
  balance: Number,
  fee: {type: Number, optional: true},
  date: Date,
  valDate: {type: Date, optional: true},
  atmDate: {type: Date, optional: true},
  purchaseDate: {type: Date, optional: true},
  company: {type: String, optional: true},
  concept: {type: String, optional: true},
  from: {type: String, optional: true},
  creditCard: {type: String, optional: true}
}, {versionKey: false});

Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
