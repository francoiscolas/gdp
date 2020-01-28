'use strict';

let Backbone = require('backbone');

var Source = Backbone.Model.extend({

  defaults: {
    name : null,
    isDir: null,
    formats: [],
  },

});

module.exports = Source;
