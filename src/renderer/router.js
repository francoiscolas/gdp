'use strict';

let _        = require('lodash');
let Backbone = require('backbone');

class Router extends Backbone.Router {

  initialize() {
    this.route('', 'index');
    this.route('screen', 'screen');
    this.route('settings', 'settings');
    this.route('associate', 'associate');
    this.route('about', 'about');
  }

  index() {
    this._showView(require('./views/mainview'));
  }

  screen() {
    let ws = new WebSocket(window.location.origin.replace(/^http/, 'ws'));

    ws.onmessage = _.bind(function (evt) {
      if (evt.data == 'updated')
        this.view.settings.fetch();
    }, this);
    this._showView(require('./views/screenview'));
  }

  settings() {
    this._showView(require('./views/settingsview'));
  }

  associate() {
    this._showView(require('./views/associateview'));
  }

  about() {
    this._showView(require('./views/aboutview'));
  }

  _showView(ViewClass) {
    this.view = new ViewClass();
    this.view.render();
  }

}

module.exports = Router;
