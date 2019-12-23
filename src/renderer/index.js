'use strict';

let $        = require('jquery');
let Backbone = require('backbone');
let Router   = require('./router');

require('./index.scss');
//require('./lib/foundation');

$(function () {
  new Router();
  Backbone.history.start();
});
