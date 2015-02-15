var _ = require('lodash'),
  moment = require('moment'),
  IngStrategy;

module.exports = IngStrategy = function(opts) {
  this.opts = opts;

  this.DATE_MASK = 'DD/MM/YYYY hh:mm:ssZ';
  this.MONEY_REGEX = /(?:\d\.?)*(?:\d{3}\.?)*(?:,\d+)* €/;

  this.patterns = {
    atm: [
      '^Reintegro efectivo'
    ],
    bill: [
      // TODO: find the matching pattern for billing
    ],
    transfer: [
      '^Transferencia recibida',
      '^Traspaso emitido'
    ],
    purchase: [
      '^Pago en',
      '^Compra Tarjeta',
      '^Pago Tarjeta'
    ],
    salary: [
      '^Nomina recibida'
    ]
  };

};

IngStrategy.prototype.parseDate = function(str) {
  return moment(str + ' 00:00:00', this.DATE_MASK);
};

IngStrategy.prototype.parseMoney = function(str) {
  return (str && str.toString().match(this.MONEY_REGEX)) ? parseFloat(str.replace(/\./, '').replace(/,/, '.'), 10) : str;
};
