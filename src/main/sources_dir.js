'use strict';

let EventEmitter = require('events');
let FS = require('fs');
let Log = require('electron-log');
let Path = require('path');
let SourcesDirEntry = require('./sources_dir_entry');

const TAG = 'SourcesDir';

let _add = function (entry) {
  return this.entries.push.apply(this.entries, arguments);
};

let _remove = function (entry) {
  return this.entries.splice(this.entries.indexOf(entry), 1);
};

class SourcesDir extends EventEmitter {

  constructor(path) {
    super();

    this.path = null;
    this.entries = [];
    this._reading = false;
    this._watcher = null;

    this.setPath(path);
  }

  setPath(path, options) {
    Log.debug(`${TAG}#setPath> this.path=${this.path} path=${path}`);
    let accessible = false;

    if (path == this.path)
      return ;

    try {
      FS.accessSync(path);
      accessible = true;
    } catch (error) {
      Log.error(`${TAG}#setPath> ${error}`, error);
    }

    if (accessible) {
      this.stopWatching();
      this._reading = false;

      this.path = path;
      this.entries.length = 0;
      this.emit('change');

      this.refresh();
      this.startWatching();
    }
    return accessible;
  }

  startWatching() {
    if (!this._watcher) 
      this._watcher = FS.watch(this.path, this.refresh.bind(this));
  }

  stopWatching() {
    if (this._watcher) {
      this._watcher.close();
      this._watcher = null;
    }
  }

  refresh() {
    if (this._reading)
      return ;

    FS.readdir(this.path, {withFileTypes: true}, (error, newEntries) => {
      if (!this._reading)
        return ;

      let removed = this.filter(entry => {
        return !newEntries.find(newEntry => newEntry.name == entry.basename);
      });
      removed.forEach(_remove.bind(this));
      Log.info(`${TAG}#refresh> removed ${removed.length} entries`);
      Log.debug(`${TAG}#refresh> removed=`, removed);

      let added = newEntries.filter(newEntry => {
        return !this.find(entry => entry.basename == newEntry.name);
      });
      added.forEach(newEntry => {
        if ((/*newEntry.isDirectory() || */newEntry.isFile())
            && !newEntry.name.startsWith('.'))
          _add.call(this, new SourcesDirEntry(Path.join(this.path, newEntry.name), newEntry));
      });
      Log.info(`${TAG}#refresh> added ${added.length} entries`);
      Log.debug(`${TAG}#refresh> added=`, added);

      if (added.length > 0 || removed.length > 0)
        this.emit('change');

      this._reading = false;
      this.emit('read');
    });
    this._reading = true;
  }

  filter(callback, thisArg) {
    return this.entries.filter(callback, thisArg || this);
  }

  find(callback, thisArg) {
    return this.entries.find(callback, thisArg || this);
  }

  findById(id) {
    return this.entries.find(entry => entry.id == id);
  }

  map(callback, thisArg) {
    return this.entries.map(callback, thisArg || this);
  }

  get length() {
    return this.entries.length;
  }

}

module.exports = SourcesDir;
