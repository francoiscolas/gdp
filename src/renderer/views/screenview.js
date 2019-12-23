"use strict";

let _                = require('lodash');
let Backbone         = require('backbone');
let Display          = require('../models/display');
let SourceCollection = require('../collections/sourcecollection');

var ScreenView = Backbone.View.extend({

  el: '#app',

  settings: null,

  sources: null,

  initialize: function (options) {
    this.settings = new Display();
    this.settings.fetch();

    this.sources = new SourceCollection();
    this.sources.fetch();
    setInterval(_.bind(this.sources.fetch, this.sources), 5000);

    this.source = null;

    this.listenTo(this.settings, 'change', this.render);
    this.listenTo(this.sources, 'add', this.render);

    this.$el.addClass('screen');
  },

  render: function () {
    let bgImage = this.settings.get('bgImage') || '';

    if (this.source) {
      this.stopListening(this.source);
    }
    if (this.settings.has('sourceId')) {
      this.source = this.sources.get(this.settings.get('sourceId'));

      if (this.source) {
        this.source.fetch();
        this.listenTo(this.source, 'change', this.render);

        if (this.source.has('pages')) {
          bgImage = this.source.get('pages')[this.settings.get('sourcePage')];
        }
      }
    }
    this.$el.css('background-color', this.settings.get('bgColor'));
    this.$el.css('background-image', `url("${bgImage}")`);
  },

});

module.exports = ScreenView;
