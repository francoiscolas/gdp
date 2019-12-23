'use strict';

let Backbone = require('backbone');

let Display = Backbone.Model.extend({
  url: '/api/display'
})

module.exports = Display;
