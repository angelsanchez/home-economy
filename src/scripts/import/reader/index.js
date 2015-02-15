var ingReader = require('./ing'),
  santanderReader = require('./santander');

module.exports = {
  create: function(strategy) {

    switch (strategy) {
      case 'ing':
        return ingReader;
      case 'santander':
        return santanderReader;

      default:
        throw new Error('Unknown reader');
    }

  }
};
