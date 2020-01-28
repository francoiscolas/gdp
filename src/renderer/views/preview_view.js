'use strict';

let $          = require('jquery');
let SourceView = require('./source_view');

let PreviewView = SourceView.extend({
  
  viewName: 'Prévisualisation',

  events: {
    'click button.publish': 'publish',
  },

  initialize: function (options) {
    SourceView.prototype.initialize.apply(this, arguments);
    this.bigScreenView = options && options.bigScreenView;
  },

  onSourceChanged: function () {
    SourceView.prototype.onSourceChanged.apply(this, arguments);
    this.$publishBtn.prop('disabled', !this.source);
  },

  getActions: function () {
    let actions = SourceView.prototype.getActions.apply(this, arguments);

    if (!this.$publishBtn) {
      this.$publishBtn = $(`
        <button class="button is-danger is-outlined publish" disabled>
          <span class="icon">
            <i class="fas fa-arrow-right"></i>
          </span>
          <span>Projeter</span>
        </button>
     `);
    }
    actions.push(this.$publishBtn);
    return actions;
  },

  publish: function () {
    this.bigScreenView.setSource(
      this.source,
      this.renderer.clone()
    );
    this.bigScreenView.render();
  },

});

module.exports = PreviewView;
