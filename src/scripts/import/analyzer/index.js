var _ = require('lodash'),
  IngStrategy = require('./ing'),
  SantanderStrategy = require('./santander');

module.exports = {
  create: function(strategy, opts) {
    switch (strategy) {

      case 'ing':
        return new Analyzer(IngStrategy, opts);

      case 'santander':
        return new Analyzer(SantanderStrategy, opts);

      default:
        throw new Error('Unknown analyzer');
    }
  }
};

function Analyzer(BankStrategy, opts) {
  this.strategy = new BankStrategy(opts);
}

Analyzer.prototype.isType = function(type, row) {
  var desc = row.description,
    _this = this;

  // if type is already set, don't match again
  if (row.type) {
    return row.type === type;
  }
  // get the type from the first matching pattern against the description
  return _.some(this.strategy.patterns[type], function(pattern) {
    var re = new RegExp(pattern, 'i');
    if (re.test(desc)) {
      _this._typeRE = re; // save RegExp to extract data
      return true;
    }
    return false;
  });

};

Analyzer.prototype.analyze = function(row) {
  var types = ['atm', 'bill', 'transfer', 'purchase', 'salary'],
    _this = this;

  row.type = _.find(types, function(type) {
    return _this.isType(type, row);
  });

  if (!row.type) {
    console.log('unknown type', row.description);
  }
  row.date = this.strategy.parseDate(row.date);
  row.amount = this.strategy.parseMoney(row.amount);
  row.balance = this.strategy.parseMoney(row.balance);
  row.ds = row.description;

  // TODO: add all optional fields
  if (row.hasOwnProperty('valDate')) {
    row.valDate = this.strategy.parseDate(row.valDate);
  }

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
