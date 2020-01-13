'use strict';

const Config = {

  ...require('./config'),

  converters: [
    require('../main/to_pdf_converter'),
  ],

};

module.exports = Config;
