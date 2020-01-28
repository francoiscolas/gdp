'use strict';

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

let RendererFactory = require('../renderer_factory');
let PdfRenderer     = require('./pdf_renderer');

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
            <div class="buttons has-addons are-small"></div>
          </div>
        </div>
      </div>
      <progress class="progress is-info" max="100">15%</progress>
      <div class="source-content"></div>
    </div>
  `),

  initialize: function (options) {
    this.display = options.display;
    this.source = null;
    this.renderer = null;

    this.rendererFactory = new RendererFactory();
    this.rendererFactory.registerRenderer(PdfRenderer);
    //this.rendererFactory.registerRenderer(ImageRenderer);

    this.listenTo(this.display, 'change:bgColor', this.render);
    this.listenTo(this.display, 'change:bgImage', this.render);

    $(window).on('resize.' + this.cid, _.debounce(this.render.bind(this), 100));

    this.initUi();
    this.resetActions();
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments);

    $(window).off('resize.' + this.cid);
    return this;
  },

  initUi: function () {
    this.$el.html(this.template());

    this.$subtitle = this.$('.subtitle');
    this.$content = this.$('.source-content');
  },

  resetActions: function () {
    let actions = [];

    if (this.renderer)
      actions = this.renderer.getActions();
    actions = actions.concat(this.getActions());
    actions.forEach(function (action) {
      this.$('.buttons').append(action);
    }.bind(this));
  },

  getActions: function () {
    if (!this.$closeBtn) {
      this.$closeBtn = $(`
        <button class="button close" disabled>
          <i class="fas fa-times"></i>
        </button>
      `).on('click', this.close.bind(this));
    }
    return [this.$closeBtn];
  },

  onSourceChanged: function () {
    this.$closeBtn.prop('disabled', !this.source);
  },

  close: function () {
    this.setSource(null, null)
    this.render();
  },

  render: function () {
    this.$subtitle.css('width', this.$subtitle.parent().width() + 'px');
    this.$subtitle.text(this.source ? this.source.get('name') : '');
    this.$content.css({
      'background-color': this.display.get('bgColor'),
      'background-image': !this.source && this.display.has('bgImage') ?
        `url(${this.display.get('bgImage')})` : 'none',
    });
    if (this.renderer)
      this.renderer.render();
    return this;
  },

  setSource: function (source, renderer) {
    if (this.renderer) {
      this.renderer.remove();
      this.renderer = null;
    }
    this.source = source
    this.renderer = renderer;

    if (!renderer && source)
      renderer = this.rendererFactory.create(source, {
        display: this.display,
        source : source,
      });
    if (!!(this.renderer = renderer)) {
      this.$content.append(this.renderer.$el);
      this.listenTo(this.renderer, 'isLoading', this.setLoading);
    }

    this.resetActions();
    this.onSourceChanged();
  },

  setLoading: function (isLoading) {
    this.$('progress')[isLoading ? 'show' : 'hide']();
  },

})

module.exports = SourceView
