"use strict";

let _        = require('lodash');
let Backbone = require('backbone');
let Electron = require('electron');
let OS       = require('os');

let App = Electron.remote.getGlobal('App');

let AssociateView = Backbone.View.extend({

  el: '#app',

  template: _.template(`
    <div class="message">
      <div class="message-body">
        <div class="has-text-centered">
          <i class="fas fa-wifi fa-5x"></i>
        </div>
        <ol>
          <li>Prendre l'appareil à associer.</li>
          <li>Ouvrir le naviguateur internet.</li>
          <li>Rendez-vous à l'adresse<br/>
            <u>http://<%= ip %>:<%= port %>/</u>.</li>
        </ol>
      </div>
    </div>
  `),

  render: function () {
    this.$el.html(this.template({
      ip: _.reduce(OS.networkInterfaces(), function (memo, addresses) {
        var local = _.find(addresses, addr => addr.address.startsWith('192.168.'));
        return (local) ? local.address : memo;
      }, undefined),
      port: App.settings.get('httpPort'),
    }));
  },

});

module.exports = AssociateView;
