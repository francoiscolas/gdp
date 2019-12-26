'use strict';

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

let SourceView = Backbone.View.extend({

  template: _.template(`
      <% if (source) { %>
        <h5><%= source.name %></h5>
      <% } %>
      <div class="source-actions">
        <button class="small button previous"><i class="fi-arrow-left"></i></button>
        <button class="small button" disabled>
          <%
          if (source)
            print(currentPage + "/" + (numPages || '?'));
          else
            print("-/-");
          %>
        </button>
        <button class="small button next"><i class="fi-arrow-right"></i></button>
        <button class="small button close"><i class="fi-x"></i></button>
      </div>
      <div class="source-preview" style="background-color:<%= display.bgColor %>;background-image:url(<%= display.bgImage %>);">
        <% if (isLoading) { %>
          <div class="loading-anim"></div>
        <% } else { %>
          <canvas></canvas>
        <% } %>
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
    this.listenTo(this.display, 'change:bgColor', this.render);
    this.listenTo(this.display, 'change:bgImage', this.render);
  },

  render: function () {
    this.$el.html(this.template({
      display    : this.display.attributes,
      source     : this.source && this.source.attributes,
      numPages   : this.source && this.source.getNumPages(),
      currentPage: this.currentPage,
      isLoading  : this.source && !this.source.getNumPages(),
    }));

    if (this.source && !this.pdfpromise) {
      this.pdfpromise = this.source.getPdfPage(this.currentPage);
      this.pdfpromise.then(function (pdfpage, numPages) {
        this.render();
        this.pdfpromise = null; // must be after the call to render()

        let viewport = pdfpage.getViewport({scale: 1});
        let canvas = this.$('canvas').get(0);

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        pdfpage.render({
          canvasContext: canvas.getContext('2d'),
          background: this.display.bgColor,
          viewport: viewport,
        });
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
    else if (page >= count)
      this.currentPage = 1;
    else
      this.currentPage = page;
    this.render();
  }

})

module.exports = SourceView
