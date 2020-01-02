'use strict';

let SourceView = require('./sourceview');

let PreviewView = SourceView.extend({
  
  viewName: 'Prévisualisation',

  initialize: function () {
    SourceView.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    SourceView.prototype.render.apply(this, arguments);
    if (this.$('button.publish').length == 0) {
      this.$('.buttons').append(`
        <button class="button is-danger is-outlined publish">
          <span class="icon">
            <i class="fas fa-arrow-right"></i>
          </span>
          <span>Projeter</span>
        </button>
      `);
    }
  },


})

module.exports = PreviewView;
