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
        <div class="level is-mobile">
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

    this.$el.html(this.template());
    this.$subtitle = this.$('.subtitle');
    this.$pages = this.$('button:disabled');
    this.$content = this.$('.source-content');
    this.$canvas = this.$('canvas');
    this.canvas = this.$canvas.get(0);

    this.listenTo(this.display, 'change:bgColor', this.render);
    this.listenTo(this.display, 'change:bgImage', this.render);

    $(window).on('resize.' + this.cid, _.debounce(this.render.bind(this), 100));
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments);

    $(window).off('resize.' + this.cid);
    return this;
  },

  render: function () {
    this.$subtitle.css('width', this.$subtitle.parent().width() + 'px');
    this.$subtitle.text(this.source ? this.source.get('name') : '');
    this.$content.css({
      'background-color': this.display.get('bgColor'),
      'background-image': !this.source && this.display.has('bgImage') ?
        `url(${this.display.get('bgImage')})` : 'none',
    });
    this.canvas.width = this.canvas.width;

    if (this.source && !this.pdfpromise) {
      this.setLoading(true);
      this.pdfpromise = this.source.getPdfPage(this.currentPage);
      this.pdfpromise.then(function (pdfpage, numPages) {
        this.pdfpromise = null;
        this.$canvas.css({width: '100%', height: 'auto'});

        let viewport = pdfpage.getViewport({scale: 1});
        let canHeight = this.$canvas.width() * viewport.height / viewport.width;

        if (canHeight > this.$canvas.parent().height())
          this.$canvas.css({width: 'auto', height: '100%'});
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        pdfpage.render({
          canvasContext: this.canvas.getContext('2d'),
          background: this.display.bgColor,
          viewport: viewport,
        });

        this.setLoading(false);
        this.updateCurrentPageUi();
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

  setSource: function (source, options) {
    this.source = source
    this.setCurrentPage(options && options.page || 1);
  },

  setCurrentPage: function (page, options) {
    let count = (this.source && this.source.getNumPages()) || 0;

    if (page <= 0)
      this.currentPage = count;
    else if (page > count)
      this.currentPage = 1;
    else
      this.currentPage = page;

    this.updateCurrentPageUi();
    this.render();
  },

  updateCurrentPageUi: function () {
    let count = this.source && this.source.getNumPages();
    this.$pages.text((count) ? this.currentPage + "/" + count : '');
  },

  setLoading: function (isLoading) {
    this.$('progress')[isLoading ? 'show' : 'hide']();
  }

})

module.exports = SourceView
