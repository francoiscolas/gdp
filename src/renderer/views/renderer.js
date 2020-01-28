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

Renderer.isRenderable = function (source) {
  return false;
};

module.exports = Renderer;
