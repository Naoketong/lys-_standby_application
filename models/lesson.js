const Base = require('./base.js');

class Lesson extends Base {
  constructor(props = 'lesson') {
    super(props);
  }
}

module.exports = new Lesson()