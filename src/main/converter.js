'use strict';

class Converter {

  static from() {
    return [];
  }

  static to() {
    return 'pdf';
  }

  constructor(cachePath) {
    this.cachePath = cachePath;
  }

  convert(inputPath, outputPath) {
  }

}

module.exports = Converter;
