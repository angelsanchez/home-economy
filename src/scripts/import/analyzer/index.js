var _ = require('lodash'),
  IngStrategy = require('./ing');

module.exports = {
  create: function(strategy, opts) {
    switch (strategy) {

      case 'ing':
        return new Analyzer(IngStrategy, opts);

      // TODO: Create a SantanderStrategy from import/santander
      default:
        throw new Error('Unknown analyzer');
    }
  }
};

function Analyzer(BankStrategy, opts) {
  this.strategy = new BankStrategy(opts);
}

Analyzer.prototype.analyze = function(row) {
  var types = ['atm', 'bill', 'transfer', 'purchase', 'salary'];
  var _this = this;

  row.type = _.find(types, function(type) {
    return _this.strategy.isType(type, row);
  });

  if (!row.type) {
    console.log('unknown type', row.description);
  }
  row.opDate = this.strategy.parseDate(row.date);
  row.amount = this.strategy.parseMoney(row.amount);
  row.balance = this.strategy.parseMoney(row.balance);
  row.ds = row.description;

  delete row.date;
  // TODO: add all optional fields

  return row;

};

// shortcut methods

Analyzer.prototype.isBill = function(row) {
  return this.strategy.isType('bill', row);
};

Analyzer.prototype.isTransfer = function(row) {
  return this.strategy.isType('transfer', row);
};

Analyzer.prototype.isPurchase = function(row) {
  return this.strategy.isType('purchase', row);
};

Analyzer.prototype.isAtm = function(row) {
  return this.strategy.isType('atm', row);
};

Analyzer.prototype.isSalary = function(row) {
  return this.strategy.isType('salary', row);
};
