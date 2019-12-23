"use strict";

let _        = require('lodash');
let Backbone = require('backbone');
var Electron = require('electron');

var App      = Electron.remote.getGlobal('App');
var Dialog   = Electron.remote.dialog;

let SettingsView = Backbone.View.extend({

  el: '#app',

  template: _.template(`
    <form action="#">
      <div class="row">
        <div class="small-12 columns">
          <label for="sources-dir-btn">Dossier des sources</label>
          <div class="input-group">
            <input type="text" id="sources-dir-input" class="input-group-field" value="<%= App.sources.sourcesDir %>"/>
            <div class="input-group-button">
              <input type="button" id="sources-dir-btn" class="button" value="Parcourir...">
            </div>
          </div>
        </div>
        <div class="small-12 columns">
          <label for="bgcolor-input">Couleur d'arrière plan</label>
          <input type="text" id="bg-color-input" value="<%= App.display.bgColor %>"/>
        </div>
        <div class="small-12 columns">
          <label for="bg-image-input">Image d'arrière plan</label>
          <div class="input-group">
            <input type="text" id="bg-image-input" class="input-group-field" value="<%= App.display.bgImage %>"/>
            <div class="input-group-button">
              <input type="button" id="bg-image-btn" class="button" value="Parcourir...">
            </div>
          </div>
        </div>
        <div class="small-12 columns text-right actions">
          <input type="button" id="cancel-btn" class="hollow button" value="Annuler"/>
          <input type="submit" id="save-btn" class="hollow button" value="Enregistrer"/>
        </div>
      </div>
    </form>
  `),

  events: {
    'click #sources-dir-btn': 'browseDirs',
    'click #bg-image-btn'   : 'browseImages',
    'click #save-btn'       : 'save',
    'click #cancel-btn'     : 'close',
  },

  initialize: function () {
    this.$el.addClass('settings');
  },

  $bgColor: function () {
    return this.$('#bg-color-input');
  },

  $bgImage: function () {
    return this.$('#bg-image-input');
  },

  $sourcesDir: function () {
    return this.$('#sources-dir-input');
  },

  render: function () {
    this.$el.html(this.template({App: App}));
  },

  browseDirs: function () {
    var entries = Dialog.showOpenDialogSync({
      defaultPath: this.$sourcesDir().val(),
      properties : ['openDirectory']
    });

    if (entries)
      this.$sourcesDir().val(entries[0]);
  },

  browseImages: function() {
    var entries = Dialog.showOpenDialogSync({
      defaultPath: this.$bgImage().val(),
      properties : ['openFile'],
      filters    : [{name: 'Images', extensions: ['jpg', 'jpeg', 'png']}],
    });

    if (entries)
      this.$bgImage().val(entries[0]);
  },

  save: function () {
    App.sources.setSourcesDir(this.$sourcesDir().val());
    App.display.set({
      bgColor: this.$bgColor().val(),
      bgImage: this.$bgImage().val(),
    });
    window.close();
  },

  close: function () {
    window.close();
  },

});

module.exports = SettingsView;
