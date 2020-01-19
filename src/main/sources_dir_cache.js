'use strict';

let FS = require('fs');
let Log = require('electron-log');
var Path = require('path');

const TAG = 'SourcesDirCache';

class SourcesDirCache {

  constructor(rootDir) {
    this.rootDir = rootDir;
    FS.mkdirSync(this.rootDir, {recursive: true});

    Log.info(`${TAG}#constructor> created SourcesDirCache with rootDir=${rootDir}`);
  }

  getPath(entry, ext) {
    return new Promise(function (resolve, reject) {
      let storedPath = Path.join(this.rootDir, entry.id + '.' + ext);

      FS.stat(entry.absolutePath, (error, entryStat) => {
        if (error) {
          reject(error);
        } else {
          FS.stat(storedPath, (error, storedStat) => {
            if (storedStat && storedStat.mtime > entryStat.mtime)
              resolve(storedPath);
            else
              resolve(null);
          });
        }
      });
    }.bind(this));
  }

  store(entry, ext, tmpPath) {
    Log.debug(`${TAG}#store> entry.id=${entry.id} ext=${ext} tmpPath=${tmpPath}`);
    return new Promise(function (resolve, reject) {
      let storedPath = Path.join(this.rootDir, entry.id + '.' + ext);

      FS.rename(tmpPath, storedPath, (error) => {
        if (error) reject(error);
        else resolve(storedPath);
      });
    }.bind(this));
  }

  forEach(callback, thisArg) {
    thisArg = thisArg || this;
    FS.readdirSync(this.rootDir)
      .forEach(function (entry) {
        callback.call(thisArg, Path.join(this.rootDir, entry));
      }, this);
    return this;
  }

  filter(callback, thisArg) {
    let entries = [];

    thisArg = thisArg || this;
    this.forEach(function (entry) {
      if (callback.call(thisArg, entry))
        entries.push(entry);
    });
    return entries;
  }

}

module.exports = SourcesDirCache;
