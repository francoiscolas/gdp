"use strict";

let _        = require('lodash');
let Backbone = require('backbone');
let Electron = require('electron');

let App = Electron.remote.getGlobal('App');

let AboutView = Backbone.View.extend({

  el: '#app',

  template: _.template(`
    <div class="message">
      <div class="message-body has-text-centered">
        <img src="${require('../../../build/icon.png').default}" width="96px"/><br/>
        <strong><%= App.getName() %></strong><br/>
        v<%= App.getVersion() %><br/>
        <a>https://github.com/francoiscolas/hibiscusapp</a>
      </div>
    </div>
  `),

  render: function () {
    this.$el.html(this.template({App: App}));
  },

});

module.exports = AboutView;
