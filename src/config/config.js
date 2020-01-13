'use strict';

const Config = {

  formats: [
    {ext: 'odp',  type: 'powerpoint', needConvert: true},
    {ext: 'pps',  type: 'powerpoint', needConvert: true},
    {ext: 'ppt',  type: 'powerpoint', needConvert: true},
    {ext: 'pptx', type: 'powerpoint', needConvert: true},
    {ext: 'pdf',  type: 'pdf',        needConvert: false},
  ],

};

module.exports = Config;
