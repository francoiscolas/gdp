"use strict";

let _        = require('lodash');
let Backbone = require('backbone');
var Electron = require('electron');

var App      = Electron.remote.getGlobal('App');
var Dialog   = Electron.remote.dialog;

let SettingsView = Backbone.View.extend({

  el: '#app',

  template: _.template(`
    <div class="message">
      <div class="message-body">
        <form action="#">
          <div class="field">
            <label class="label" for="sources-dir-input">Dossier des sources</label>
          </div>
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" id="sources-dir-input" value="<%= App.sources.path %>"/>
            </div>
            <div class="control">
              <input class="button" type="button" id="sources-dir-btn" value="Parcourir...">
            </div>
          </div>
          <div class="field">
            <label class="label" for="bg-color-input">Couleur d'arrière plan</label>
            <div class="control">
              <input class="input" type="text" id="bg-color-input" value="<%= App.display.bgColor %>"/>
            </div>
          </div>
          <div class="field">
            <label class="label" for="bg-image-input">Image d'arrière plan</label>
          </div>
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" id="bg-image-input" value="<%= App.display.bgImage %>"/>
            </div>
            <div class="control">
              <input class="button" type="button" id="bg-image-btn" value="Parcourir..."/>
            </div>
          </div>
          <div class="field is-grouped is-grouped-right">
            <div class="control">
              <input class="button" type="button" id="cancel-btn" value="Annuler"/>
            </div>
            <div class="control">
              <input class="button is-primary" type="submit" id="save-btn" value="Enregistrer"/>
            </div>
          </div>
        </form>
      </div>
    </div>
  `),

  events: {
    'click #sources-dir-btn': 'browseDirs',
    'click #bg-image-btn'   : 'browseImages',
    'click #save-btn'       : 'save',
    'click #cancel-btn'     : 'close',
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
    App.sources.setPath(this.$sourcesDir().val());
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
