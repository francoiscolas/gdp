'use strict';

let FS = require('fs');
let Log = require('electron-log');
let OS = require('os');
let Path = require('path');

let ConverterFactory = require('./converter_factory');
let SourcesDir = require('./sources_dir');
let SourcesDirCache = require('./sources_dir_cache');

const TAG = 'SourcesDirMediator';

class SourcesDirMediator {

  constructor(privatePath, sourcesPath, config) {
    this.tmpPath = Path.join(privatePath, 'HbsTmp');
    FS.mkdirSync(this.tmpPath, {recursive: true});

    this.formats = config.formats;

    this.sources = new SourcesDir();
    this.sources.setPath(sourcesPath);

    this.converters = new ConverterFactory();
    config.converters.forEach(this.converters.registerConverter, this.converters);

    this.cache = new SourcesDirCache(Path.join(privatePath, 'HbsCache'));
  }

  formatsFor(entry) {
    let ext = entry.ext.toLowerCase();
    return this.formats
      .filter(f => (f.ext == ext && !f.needConvert))
      .map(f => f.ext)
      .concat(this.converters.formatsFor(ext));
  }

  getPath(entry, ext) {
    return new Promise(function (resolve, reject) {
      if (entry.ext == ext) {
        resolve(entry.absolutePath);
      } else {
        this.cache.getPath(entry, ext)
          .then(cachedPath => {
            if (cachedPath) {
              resolve(cachedPath);
            } else {
              let tmpPath = Path.join(this.tmpPath, `${entry.id}.${Date.now()}`);
              let converter = this.converters.create(entry.ext, ext);
              return converter.convert(entry.absolutePath, tmpPath)
                .then(outputPath => this.cache.store(entry, ext, outputPath))
                .then(resolve);
            }
          })
          .catch(error => {
            Log.error(`${TAG}#getPath> id=${entry.id} ext=${ext} error=${error.message}`);
            Log.error(error);
            reject(error);
          });
      }
    }.bind(this));
  }

//  filter(callback, thisArg) {
//    return this.sources.filter(callback, thisArg || this);
//  }
//
//  find(callback, thisArg) {
//    return this.sources.find(callback, thisArg || this);
//  }
//
//  findById(id) {
//    return this.sources.find(entry => entry.id == id);
//  }
//
//  map(callback, thisArg) {
//    return this.sources.map(callback, thisArg || this);
//  }
//
//  get length() {
//    return this.sources.length;
//  }

}

module.exports = SourcesDirMediator;
