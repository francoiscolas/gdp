'use strict';

let Backbone = require('backbone');

let BigScreen = Backbone.Model.extend({
  url: '/api/bigscreen'
})

module.exports = BigScreen;
