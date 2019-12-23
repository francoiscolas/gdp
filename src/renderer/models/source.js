'use strict';

let Backbone = require('backbone');

var Source = Backbone.Model.extend({
  defaults: {
    name : null,
    pages: []
  }
});

module.exports = Source;
