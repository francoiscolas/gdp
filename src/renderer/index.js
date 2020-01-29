'use strict';

require('./index.scss');
require('@fortawesome/fontawesome-free/css/fontawesome.css');
require('@fortawesome/fontawesome-free/css/solid.css');

let Config   = require('../config/config-renderer');

let $        = require('jquery');
let Backbone = require('backbone');
let Router   = require('./router');

$(function () {
  let router = new Router();

  Config.renderers.forEach(
    router.rendererFactory.registerRenderer,
    router.rendererFactory
  );
  Backbone.history.start();
});
