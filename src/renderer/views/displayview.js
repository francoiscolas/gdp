'use strict'

let SourceView = require('./sourceview')

let DisplayView = SourceView.extend({
  
  viewName: 'Projection',

  initialize: function () {
    SourceView.prototype.initialize.apply(this, arguments)
  },

  setSource: function () {
    SourceView.prototype.setSource.apply(this, arguments)
    this.display.save({
      sourceId: (this.source) ? this.source.id : null,
      sourcePage: this.currentPage
    })
  },

  setCurrentPage: function () {
    SourceView.prototype.setCurrentPage.apply(this, arguments)
    this.display.save('sourcePage', this.currentPage)
  }

})

module.exports = DisplayView
