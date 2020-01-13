'use strict';

let Backbone = require('backbone');

let PDFJS = require('../lib/pdf');
let PDFJSWorker = require('../lib/pdf.worker.js'); // ensure it's included in the build
PDFJS.GlobalWorkerOptions.workerSrc = '../lib/pdf.worker.js';

var Source = Backbone.Model.extend({

  defaults: {
    name : null,
    isDir: null,
    formats: [],
  },

  initialize: function () {
    this.pdfdoc = null;
    this.pdfdocTask = null;

    this.pdfpages = [];
    this.pdfpagesTasks = [];
  },

  getFileUrl: function () {
    return new Promise(function (resolve, reject) {
      if (this.get('isDir')) {
        reject(new Error("Can't download a directory."));
      } else {
        let format = this.get('formats').find(format => format.type == 'pdf');

        if (format)
          resolve(format.url);
        else
          reject(new Error('Unsupported file type.'));
      }
    }.bind(this));
  },

  getPdfDoc: function () {
    return new Promise(function (resolve, reject) {
      if (this.pdfdoc) {
        resolve(this.pdfdoc);
      } else {
        this.getFileUrl()
          .then(function (fileurl) {
            if (this.pdfdocTask) {
              this.pdfdocTask.promise.then(resolve).catch(reject);
            } else {
              this.pdfdocTask = PDFJS.getDocument(fileurl);
              this.pdfdocTask.promise
                .then(function (pdfdoc) {
                  this.pdfdoc = pdfdoc;
                  this.pdfdocTask = null;
                  resolve(pdfdoc);
                }.bind(this))
                .catch(reject);
            }
          }.bind(this))
          .catch(reject);
      }
    }.bind(this));
  },

  getPdfPage: function (page) {
    return new Promise(function (resolve, reject) {
      this.getPdfDoc()
        .then(function (pdfdoc) {
          if (this.pdfpages[page]) {
            resolve(this.pdfpages[page]);
          } else if (this.pdfpagesTasks[page]) {
            this.pdfpagesTasks[page].then(resolve).catch(reject);
          } else {
            this.pdfpagesTasks[page] = pdfdoc.getPage(page);
            this.pdfpagesTasks[page]
              .then(function (pdfpage) {
                this.pdfpages[page] = pdfpage;
                this.pdfpagesTasks[page] = null;
                resolve(pdfpage);
              }.bind(this))
              .catch(reject);
          }
        }.bind(this));
    }.bind(this));
  },

  getNumPages: function () {
    return (this.pdfdoc && this.pdfdoc.numPages) || 0
  },

});

module.exports = Source;
