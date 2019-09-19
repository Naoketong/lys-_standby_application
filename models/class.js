const Base = require('./base.js');

class Class extends Base {
  constructor(props = 'class') {
    super(props);
  }
}

module.exports = new Class()