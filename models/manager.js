const Base = require('./base.js');

class Manager extends Base {
  constructor(props = 'manager') {
    super(props);
  }
}

module.exports = new Manager()