'use strict';

let Renderer = require('./renderer');

let ImageRenderer = Renderer.extend({

  render: function () {
    Renderer.prototype.render.apply(this, arguments);
    let format = this.source && this.source.get('formats')[0];
    let url    = format && format.url;

    this.$el.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'contain',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'width': '100%',
      'height': '100%',
    });
  },

});

ImageRenderer.isRenderable = function (source) {
  return !!source.get('formats').find(format => [
    'png',
    'jpg',
    'jpeg',
    'gif'
  ].includes(format.type));
};

module.exports = ImageRenderer;
