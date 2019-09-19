const Base = require('./base.js');

class UserLesson extends Base {
  constructor(props = 'user_lesson') {
    super(props);
  }
}

module.exports = new UserLesson()