var ingReader = require('./ing');

module.exports = {
  create: function(strategy) {

    switch (strategy) {
      case 'ing':
        return ingReader;

      default:
        throw new Error('Unknown reader');

    }

  }
};
