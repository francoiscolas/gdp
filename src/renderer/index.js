'use strict';

let $        = require('jquery');
let Backbone = require('backbone');
let Router   = require('./router');

require('./index.scss');
require('@fortawesome/fontawesome-free/js/all.js');

$(function () {
  new Router();
  Backbone.history.start();
});
