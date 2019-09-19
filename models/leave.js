const Base = require('./base.js');

class Leave extends Base {
  constructor(props = 'leave') {
    super(props);
  }
}

module.exports = new Leave()