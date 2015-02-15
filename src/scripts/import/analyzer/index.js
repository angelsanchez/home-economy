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

  // if type is already set, don't match again
  if (row.type) {
    return row.type === type;
  }
  // get the type from the first matching pattern against the description
  return _.some(this.strategy.patterns[type], function(pattern) {
    var re = new RegExp(pattern, 'i');
    if (re.test(row.description)) {
      row._dsMatches = re.exec(row.description); // expose description regexp matches
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
    row.type = 'unknown';
    console.log('WARN: unknown type for the desc="' + row.description + '"');
  }

  row.date = this.strategy.parseDate(row.date);
  row.ds = row.description;

  this.strategy.parseFields(row);

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
