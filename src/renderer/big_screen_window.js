"use strict";

let _                = require('lodash');
let Backbone         = require('backbone');
let Display          = require('./models/display');
let SourceCollection = require('./collections/sourcecollection');

var ScreenView = Backbone.View.extend({

  el: '#app',

  settings: null,

  sources: null,

  initialize: function (options) {
    this.settings = new Display();
    this.settings.fetch({success: this.initRenderer.bind(this)});

    this.source = null;
    this.sources = new SourceCollection();
    this.sources.fetch({success: this.initRenderer.bind(this)});

    this.rendererFactory = options.rendererFactory;

    this.listenTo(this.settings, 'change:bgColor change:bgImage', this.render);
    this.listenTo(this.settings, 'change:sourceId', this.onSourceChanged);
    this.listenTo(this.settings, 'change:sourcePage', this.onPageChanged);
  },

  render: function () {
    let bgImage = (!this.settings.get('sourceId')
      && this.settings.get('bgImage')) || '';

    this.$el.css('background-color', this.settings.get('bgColor'));
    this.$el.css('background-image', `url("${bgImage}")`);

    if (this.renderer)
      this.renderer.render();
  },

  initRenderer: function () {
    this.onSourceChanged({render: false});
    this.onPageChanged({render: false});
    this.render();
  },

  onSourceChanged: function (options) {
    if (this.renderer) {
      this.renderer.remove();
      this.renderer = null;
    }
    this.source = this.sources.get(this.settings.get('sourceId'));
    if (this.source) {
      this.renderer = this.rendererFactory.create(this.source, {
        display: this.settings,
        source : this.source,
      });
      this.$el.append(this.renderer.$el);
    }
    if (!options || options.render !== false)
      this.render();
  },

  onPageChanged: function (options) {
    if (this.renderer && this.renderer.setPage)
      this.renderer.page = this.settings.get('sourcePage');
    if (!options || options.render !== false)
      this.render();
  },

});

module.exports = ScreenView;
