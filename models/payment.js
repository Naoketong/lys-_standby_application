const Base = require('./base.js');

class Payment extends Base {
  constructor(props = 'payment') {
    super(props);
  }
}

module.exports = new Payment()