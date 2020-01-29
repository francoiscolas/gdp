'use strict';

const Config = {

  ...require('./config'),

  renderers: [
    require('../renderer/views/image_renderer'),
    require('../renderer/views/pdf_renderer'),
  ],

};

module.exports = Config;
