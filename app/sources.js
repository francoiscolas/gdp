'use strict';

var _            = require('lodash');
var EventEmitter = require('events');
var FS           = require('mz/fs');
var Path         = require('path');
var Process      = require('process');
var ChildProcess = require('mz/child_process');

var MD5 = function (text) {
  return require('crypto').createHash('md5').update(text).digest('hex');
};

class Source {

  constructor(sources, filepath) {
    var parsed = Path.parse(filepath);

    this.id       = MD5(parsed.base);
    this.sources  = sources;
    this.filepath = filepath;
    this.basename = parsed.base;
    this.name     = parsed.name;
    this.extname  = parsed.ext;
    this._slides  = [];

    this.getSlides();
  }

  getCacheDir() {
    return Path.join(this.sources.userDir, 'slides', this.id);
  }

  getPdfPath() {
    return Path.join(this.getCacheDir(), this.basename.replace(RegExp(this.extname + '$'), '.pdf'));
  }

  getSlides() {
    return SlidesGenerator.enqueue(this, {force: true});
  }

  deleteSlides() {
    var dir = this.getCacheDir();

    try {
      FS.readdirSync(dir)
        .map(entry => Path.join(dir, entry))
        .forEach(FS.unlinkSync);
      FS.rmdirSync(dir);
    } catch (error) {
      // ignore error
    }

    SlidesGenerator.cancel(this);
  }

}

class Sources extends EventEmitter {

  constructor() {
    super();
    this.sourcesDir = null;
    this.userDir = null;
    this._sources = [];
    this._indexing = false;
    this._walking = false;
    this._watcher = null;
  }

  find(callback, thisArg) {
    return this._sources.find(callback, thisArg || this);
  }

  findById(id) {
    return this._sources.find(source => source.id == id);
  }

  forEach(callback, thisArg) {
    return this._sources.forEach(callback, thisArg || this);
  }

  map(callback, thisArg) {
    return this._sources.map(callback, thisArg || this);
  }

  add() {
    return this._sources.push.apply(this._sources, arguments);
  }

  remove(source) {
    source.deleteSlides();
    return this._sources.splice(this._sources.indexOf(source), 1);
  }

  clear() {
    while (this._sources.length > 0)
      this.remove(this._sources[0]);
  }

  setSourcesDir(sourcesDir) {
    if (sourcesDir == this.sourcesDir)
      return ;

    if (this.sourcesDir)
      this._stopIndexing();
    this.clear();

    this.sourcesDir = sourcesDir;

    try {
      FS.accessSync(this.sourcesDir);
      this._startIndexing()
    } catch (error) {
      console.log(error);
    }

    this.emit('change');
  }

  setUserDir(userDir) {
    this.clear();
    this.userDir = userDir;
  }

  _startIndexing() {
    if (this._indexing)
      return ;
    this.length = 0;
    this._indexing = true;
    this._watcher = FS.watch(this.sourcesDir, _.bind(this._walk, this));
    this._walk();
  }

  _stopIndexing() {
    if (this._indexing) {
      this._indexing = false;
    }
    if (this._walking) {
      this._walking = false;
    }
    if (this._watcher) {
      this._watcher.close();
      this._watcher = null;
    }
  }

  _walk() {
    if (!this._indexing || this._walking)
      return ;

    FS.readdir(this.sourcesDir).then(entries => {
      if (this._walking) {
        var added   = [];
        var removed = [];

        added = entries.filter(entry => {
          return !this.find(source => Path.basename(source.filepath) == entry);
        });
        added.forEach(entry => {
          if (entry.endsWith('.odp')
              || entry.endsWith('.pps')
              || entry.endsWith('.ppt')
              || entry.endsWith('.pptx'))
            this.add(new Source(this, Path.join(this.sourcesDir, entry)));
        });

        removed = Array.from(this).filter(source => {
          return !entries.includes(Path.basename(source.filepath));
        });
        removed.forEach(source => {
          this.remove(source);
        });

        this._walking = false;
      }
    });
    this._walking = true;
  }

}

var SlidesGenerator = (function () {

  var queue = [];

  var current = null;

  return {

    enqueue: function (source, options) {
      return new Promise((resolve, reject) => {
        var data = {
          source : source,
          resolve: resolve,
          reject : reject,
        };

        if (options && options.force) {
          queue.unshift(data);
        } else {
          queue.push(data);
        }
        if (!current) {
          this.dequeue();
        }
      });
    },

    dequeue: function () {
      var dir;
      var promise;

      if (current || !queue.length)
        return ;

      current = queue.shift();
      dir = current.source.getCacheDir();

      FS.stat(current.source.filepath, (error, srcstat) => {
        FS.stat(current.source.getPdfPath(), (error, pdfstat) => {
          if (!pdfstat || srcstat.mtime > pdfstat.mtime) {
            promise = ChildProcess.execFile(Binaries.libreoffice, [
              '--headless',
              '--convert-to', 'pdf',
              '--outdir', dir,
              current.source.filepath
            ])
            .then(() => {
              return ChildProcess.execFile(Binaries.convert, [
                current.source.getPdfPath(),
                Path.join(dir, '%07d.jpg'),
              ])
            })
            .catch(error => console.log(error));
          } else {
            promise = Promise.resolve();
          }
          promise
            .then(() => {
              return FS.readdir(dir);
            })
            .then(entries => {
              current.source._slides = entries
                .filter(entry => entry.endsWith('.jpg'))
                .map(entry => Path.join(current.source.getCacheDir(), entry))
                .sort();
              current.resolve(current.source._slides);
              current = null;
              this.dequeue();
            })
            .catch(error => {
              console.log(error);
              current.reject(error);
              current = null;
              this.dequeue();
            });
        });
      });
    },

    cancel: function (source) {
      var i = queue.findIndex(item => item.source.id == source.id);

      if (i >= 0)
        queue.splice(i, 1);
    }

  };

})();

var Binaries = (function () {

  var root;

  if (Process.platform == 'win32') {
    if (App.isDev)
      root = Path.join(__dirname, '..', 'build', 'win');
    else
      root = Process.resourcesPath;
  }

  return {

    libreoffice: (function () {
      if (root)
        return Path.join(root, 'LibreOffice', 'LibreOfficePortable');
      return 'libreoffice';
    })(),

    convert: (function () {
      if (root)
        return Path.join(root, 'ImageMagick', 'convert');
      return 'convert';
    })(),

  };

})();

module.exports = Sources;
