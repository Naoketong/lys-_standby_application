const Base = require('./base.js');

class Course extends Base {
  constructor(props = 'course') {
    super(props);
  }
}

module.exports = new Course()