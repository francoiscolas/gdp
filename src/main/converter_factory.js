'use strict';

class ConverterFactory {

  constructor() {
    this.converters = [];
  }

  create(from, to) {
    let Converter = this.converters.find(Converter =>
      (Converter.from().includes(from) && Converter.to() == to))
    return (Converter) ? new Converter() : null;
  }

  formatsFor(ext) {
    ext = ext.toLowerCase();
    return this.converters
      .filter(Converter => Converter.from().includes(ext))
      .map(Converter => Converter.to());
  }

  registerConverter(Class) {
    this.converters.push(Class);
  }

  unregisterConverter(Class) {
    this.converters.splice(this.converters.indexOf(Class), 1);
  }

}

module.exports = ConverterFactory;
