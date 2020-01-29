'use strict';

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

let RendererFactory = require('./renderer_factory');

class Router extends Backbone.Router {

  initialize() {
    this.route('', 'index');
    this.route('screen', 'screen');
    this.route('settings', 'settings');
    this.route('associate', 'associate');
    this.route('about', 'about');
    this.rendererFactory = new RendererFactory();
  }

  execute(callback, args, name) {
    super.execute(callback, args, name);
    $('html').addClass('ep-' + name);
  }

  index() {
    let ws = new WebSocket(window.location.origin.replace(/^http/, 'ws'));

    ws.onmessage = _.bind(function (evt) {
      let msg = JSON.parse(evt.data);

      if (msg.command == 'sources.change')
        this.view.sources.reset(msg.data);
      if (msg.command == 'display.change')
        this.view.display.set(msg.data);
    }, this);
    this._showView(require('./main_window'), {
      rendererFactory: this.rendererFactory
    });
  }

  screen() {
    let ws = new WebSocket(window.location.origin.replace(/^http/, 'ws'));

    ws.onmessage = _.bind(function (evt) {
      let msg = JSON.parse(evt.data);

      if (msg.command == 'sources.change')
        this.view.sources.reset(msg.data);
      if (msg.command == 'display.change')
        this.view.settings.set(msg.data);
    }, this);
    this._showView(require('./big_screen_window'), {
      rendererFactory: this.rendererFactory
    });
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

  _showView(ViewClass, options) {
    this.view = new ViewClass(options);
    this.view.render();
  }

}

module.exports = Router;
