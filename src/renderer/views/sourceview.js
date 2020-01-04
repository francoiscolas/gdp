'use strict';

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

let SourceView = Backbone.View.extend({

  viewName: '?',

  template: _.template(`
    <div class="panel source-panel">
      <div class="panel-heading"><%= this.viewName %></div>
      <div class="panel-block is-block source-actions">
        <div class="level">
          <div class="level-left">
            <div class="subtitle"></div>
          </div>
          <div class="level-right">
            <div class="buttons has-addons are-small">
              <button class="button previous"><i class="fas fa-arrow-left"></i></button>
              <button class="button" disabled></button>
              <button class="button next"><i class="fas fa-arrow-right"></i></button>
              <button class="button close"><i class="fas fa-times"></i></button>
            </div>
          </div>
        </div>
      </div>
      <progress class="progress is-info" max="100">15%</progress>
      <div class="source-content">
        <canvas></canvas>
      </div>
    </div>
  `),

  events: {
    'click button.previous': 'backward',
    'click button.next'    : 'forward',
    'click button.close'   : 'close',
  },

  initialize: function (options) {
    this.display = options.display;
    this.source = null;
    this.currentPage = 1;
    this.pdfpromise = null;
    this.$subtitle = null;
    this.$pages = null;
    this.$content = null;
    this.canvas = null;
    this.listenTo(this.display, 'change:bgColor', this.render);
    this.listenTo(this.display, 'change:bgImage', this.render);
  },

  render: function () {
    if (this.$el.is(':empty')) {
      this.$el.html(this.template());
      this.$subtitle = this.$('.subtitle');
      this.$pages = this.$('button:disabled');
      this.$content = this.$('.source-content');
      this.canvas = this.$('canvas').get(0);
    }

    this.$subtitle.text('');
    this.$pages.text('-/-');
    this.$content.css({
      'background-color': this.display.get('bgColor'),
      'background-image': this.display.has('bgImage') ?
        `url(${this.display.get('bgImage')})` : 'none',
    });
    this.canvas.width = this.canvas.width;

    if (this.source && !this.pdfpromise) {
      this.$subtitle.text(this.source.get('name'));
      this.$('progress').show();

      this.pdfpromise = this.source.getPdfPage(this.currentPage);
      this.pdfpromise.then(function (pdfpage, numPages) {
        this.pdfpromise = null;

        let viewport = pdfpage.getViewport({scale: 1});
        let ratio = this.canvas.clientWidth / viewport.width;

        viewport = pdfpage.getViewport({scale: ratio});
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        pdfpage.render({
          canvasContext: this.canvas.getContext('2d'),
          background: this.display.bgColor,
          viewport: viewport,
        });

        this.$pages.text(this.currentPage + "/" + (this.source.getNumPages() || '?'));
        this.$('progress').hide();
      }.bind(this));
    }

    return this;
  },

  backward: function () {
    this.setCurrentPage(this.currentPage - 1)
  },

  forward: function () {
    this.setCurrentPage(this.currentPage + 1)
  },

  close: function () {
    this.setSource(null)
  },

  setSource: function (source) {
    if (this.source) {
      this.stopListening(this.source)
    }

    this.source = source
    this.currentPage = 1

    if (this.source) {
      this.source.fetch()
      this.listenTo(this.source, 'change', this.render)
    }

    this.render()
  },

  setCurrentPage: function (page) {
    let count = this.source && this.source.getNumPages();

    if (page <= 0)
      this.currentPage = count;
    else if (page > count)
      this.currentPage = 1;
    else
      this.currentPage = page;
    this.render();
  }

})

module.exports = SourceView
