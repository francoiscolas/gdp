"use strict";

let _        = require('lodash');
let Backbone = require('backbone');
let Electron = require('electron');
let OS       = require('os');

let App = Electron.remote.getGlobal('App');

let AssociateView = Backbone.View.extend({

  el: '#app',

  template: _.template(`
    <div class="row">
      <div class="small-10 small-centered columns">
        <div class="text-center">
          <i class="fi-mobile-signal"></i>
        </div>
        <ol>
          <li>Prendre l'appareil à associer.</li>
          <li>Ouvrir le naviguateur internet.</li>
          <li>Rendez-vous à l'adresse <u>http://<%= ip %>:<%= port %>/</u>.</li>
        </ol>
      </div>
    </div>
  `),

  initialize: function () {
    this.$el.addClass('associate');
  },

  render: function () {
    this.$el.html(this.template({
      ip: _.reduce(OS.networkInterfaces(), function (memo, addresses) {
        var local = _.find(addresses, addr => addr.address.startsWith('192.168.'));
        return (local) ? local.address : memo;
      }, undefined),
      port: App.settings.getSync('httpPort'),
    }));
  },

});

module.exports = AssociateView;
