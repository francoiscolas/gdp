'use strict';

let _         = require('lodash');
let Backbone  = require('backbone');
let Source    = require('../models/source');
let rmAccents = require('../rm_accents');

let SourceCollection = Backbone.Collection.extend({

  model: Source,

  url: '/api/sources',

  comparator: 'name',

  comparator: function (a, b) {
    let aDir = a.get('isDir');
    let aName = rmAccents(a.get('name'));

    let bDir = b.get('isDir');
    let bName = rmAccents(b.get('name'));

    if (aDir && !bDir) return -1;
    if (!aDir && bDir) return 1;
    if (aName < bName) return -1;
    return 1;
  },

  moveTo: function (source) {
    let destId = (source == '..') ? source : source.id;
    Backbone.$.ajax(_.result(this, 'url'), {
      method: 'PUT',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({destId: destId}),
    });
  }

});

module.exports = SourceCollection;
