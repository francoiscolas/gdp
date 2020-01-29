'use strict';

let $                 = require('jquery');
let PaginableRenderer = require('./paginable_renderer');

let PDFJS = require('../lib/pdf');
let PDFJSWorker = require('../lib/pdf.worker.js'); // ensure it's included in the build
PDFJS.GlobalWorkerOptions.workerSrc = '../lib/pdf.worker.js';

let _pdfDoc = function () {
  let format = this.source.get('formats')
    .find(format => format.type == 'pdf');
  let url = format && format.url;
  return PDFJS.getDocument(url).promise;
};

let _pdfPage = function () {
  return this.pdfDoc.getPage(this.page);
};

let PdfRenderer = PaginableRenderer.extend({

  tagName: 'canvas',

  initialize: function (options) {
    PaginableRenderer.prototype.initialize.apply(this, arguments);
    $(window).on('resize.' + this.cid, _.debounce(this.render.bind(this), 100));

    _pdfDoc.call(this).then(function (pdfDoc) {
      this.pdfDoc = pdfDoc;
      this.setPageCount(pdfDoc.numPages);
      this.render();
    }.bind(this));
    _.defer(this.trigger.bind(this), 'isLoading', true);
  },

  remove: function () {
    PaginableRenderer.prototype.remove.apply(this, arguments);
    $(window).off('resize.' + this.cid);

    if (this.pdfDoc)
      this.pdfDoc.destroy();
    return this;
  },

  render: function () {
    PaginableRenderer.prototype.render.apply(this, arguments);

    if (this.pdfDoc && !this.pdfPromise) {
      this.$el.hide();
      this.el.width = this.el.width;
      this.trigger('isLoading', true);
      this.pdfPromise = _pdfPage.call(this).then(function (pdfPage) {
        this.$el.css({width: '100%', height: 'auto'});

        let viewport = pdfPage.getViewport({scale: 1});
        let canHeight = this.$el.width() * viewport.height / viewport.width;

        if (canHeight > this.$el.parent().height())
          this.$el.css({width: 'auto', height: '100%'});
        this.el.width = viewport.width;
        this.el.height = viewport.height;
        pdfPage.render({
          canvasContext: this.el.getContext('2d'),
          background: this.display.bgColor,
          viewport: viewport,
        }).promise.then(function () {
          this.$el.show();
          this.pdfPromise = null;
          this.trigger('isLoading', false);
        }.bind(this));
      }.bind(this));
    }
  },

  clone: function () {
    return new PdfRenderer(this);
  },

});

PdfRenderer.type = 'pdf';

module.exports =  PdfRenderer;
