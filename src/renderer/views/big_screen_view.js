'use strict'

let SourceView = require('./source_view')

let DisplayView = SourceView.extend({
  
  viewName: 'Projection',

  initialize: function () {
    SourceView.prototype.initialize.apply(this, arguments)
  },

  onSourceChanged: function () {
    SourceView.prototype.onSourceChanged.apply(this, arguments);
    if (this.renderer)
      this.listenTo(this.renderer, 'change', this.pushSettings);
    this.pushSettings();
  },

  pushSettings: function () {
    this.display.save({
      sourceId: (this.source) ? this.source.id : null,
      sourceData: this.renderer && this.renderer.getData(),
    });
  }

})

module.exports = DisplayView
