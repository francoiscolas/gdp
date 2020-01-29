'use strict';

let $        = require('jquery');
let Backbone = require('backbone');

let Renderer = Backbone.View.extend({

  initialize: function (options) {
    if (options instanceof Renderer) {
      this.display = options.display;
      this.source  = options.source;
      this.el      = document.createElement(this.tagName);
      this.$el     = $(this.el);
    } else {
      this.display = options && options.display;
      this.source  = options && options.source;
    }
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments);

    this.getActions().forEach(function (action) {
      action.off().remove();
    });
    return this;
  },

  getActions: function () {
    return [];
  },

  clone: function () {
    return null;
  },

});

Renderer.type = null;

Renderer.isRenderable = function (source) {
  const Config   = require('../../config/config-renderer');
  let type       = this.type;
  let extensions = [];

  Config.formats.forEach(function (format) {
    if (format.type == type)
      extensions.push(format.ext);
  });
  return !!source && !!source.get('formats')
    .find(function (format) {
      return extensions.includes(format.type);
    });
};

module.exports = Renderer;
