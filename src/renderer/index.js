'use strict';

require('./index.scss');
require('@fortawesome/fontawesome-free/css/all.css');

let $        = require('jquery');
let Backbone = require('backbone');
let Router   = require('./router');

$(function () {
  new Router();
  Backbone.history.start();
});
