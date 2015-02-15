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
      '^TRANSFERENCIA DE (.+), CONCEPTO ?(.*)$',
      '^TRANSFERENCIA A FAVOR DE (.*) CONCEPTO ?(.*)$'
    ],
    purchase: [
      '^COMPRA EN (.+), CON LA TARJETA : (\\d+) EL (\\d\\d\\d\\d-\\d\\d-\\d\\d)$'
    ],
    salary: [
    ]
  };

};

SantanderStrategy.prototype.parseDate = function(str) {
  return moment(str, this.DATE_MASK).toDate();
};

SantanderStrategy.prototype.parseFields = function(row) {
  row.valDate = this.parseDate(row.valDate);

  switch (row.type) {
    case 'atm':
      row.creditCard = row._dsMatches[1];
      row.fee = Number(row._dsMatches[2].replace(',', '.'));
      row.atmDate = new Date(row._dsMatches[3]);
      break;
    case 'transfer':
      row.from = row._dsMatches[1];
      row.concept = row._dsMatches[2];
      break;
    case 'bill':
      row.company = row._dsMatches[1];
      break;
    case 'purchase':
      row.company = row._dsMatches[1];
      row.creditCard = row._dsMatches[2];
      row.purchaseDate = new Date(row._dsMatches[3]);
      break;
  }
};
