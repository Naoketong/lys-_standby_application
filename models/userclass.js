const Base = require('./base.js');

class UserClass extends Base {
  constructor(props = 'user_class') {
    super(props);
  }
}

module.exports = new UserClass()