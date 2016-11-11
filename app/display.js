var _            = require('lodash');
var EventEmitter = require('events');

class Display extends EventEmitter {

  constructor(options) {
    super();
    this.bgColor = _.get(options, 'bgColor', 'black');
    this.bgImage = _.get(options, 'bgImage');
    this.sourceId = null;
    this.sourcePage = 0;
  }

  set(key, value, options) {
    var trigger = _.get(options, 'trigger', true);

    if (_.isObject(key)) {
      _.forIn(key, (value, key) => {
        this.set(key, value, {trigger: false});
      });
    } else if (_.has(this, key)) {
      this[key] = value;
    }

    if (trigger) {
      this.emit('change');
    }
  }

}

module.exports = Display;
