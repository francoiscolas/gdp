'use strict';

let Backbone = require('backbone');
let Source   = require('../models/source');

let SourceCollection = Backbone.Collection.extend({

  model: Source,

  url: '/api/sources',

  comparator: 'name',

});

module.exports = SourceCollection;
