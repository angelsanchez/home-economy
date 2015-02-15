var _ = require('lodash'),
  moment = require('moment'),
  SantanderStrategy;

module.exports = SantanderStrategy = function(opts) {
  this.opts = opts;

  this.DATE_MASK = 'DD/MM/YYYY';

  this.patterns = {
    atm: [
      '^DISPOSICION EN CAJERO CON LA TARJETA (.+), COMISION (.+), EL (\\d\\d\\d\\d-\\d\\d-\\d\\d)$'
    ],
    bill: [
      '^PAGO RECIBO DE (.+)(,| Nº)',
      '^RECIBO (.+)(,| Nº)'
    ],
    transfer: [
      '^TRANSFERENCIA DE (.+), CONCEPTO ?(.*)'
    ],
    purchase: [
      '^COMPRA EN (.+), CON LA TARJETA : (\\d+) EL (\\d\\d\\d\\d-\\d\\d-\\d\\d)$'
    ],
    salary: [
    ]
  };

};

SantanderStrategy.prototype.parseDate = function(str) {
  return moment(str, this.DATE_MASK);
};

SantanderStrategy.prototype.parseMoney = function(str) {
  return str; // no needed because santander-reader returns numbers instead of strings
};
