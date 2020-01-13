'use strict';

let Log = require('electron-log');
let Path = require('path');

const TAG = 'SourcesApi';

class SourcesApi {

  constructor(mediator) {
    this.mediator = mediator;
    this.sources = mediator.sources;
  }

  _getData(url) {
    return this.sources.map(entry => {
      return this._getEntryData(entry, url + '/' + entry.id);
    }).sort()
  }

  _getEntryData(entry, url) {
    let data = {
      id  : entry.id,
      name: entry.basename,
      url : url,
      isDir : entry.isDirectory(),
    };

    if (entry.isFile())
      data.formats = this.mediator.formatsFor(entry).map(format => {
        return {type: format, url: url + '.' + format};
      });
    return data;
  }

  index(req, res) {
    Log.debug(`${TAG}#index> ip=${req.connection.remoteAddress}> ${this.sources.length} sources`);
    res.send(this._getData(req.url));
  }

  update(req, res) {
    Log.debug(`${TAG}#update> ip=${req.connection.remoteAddress} destId=${req.body.destId}`);
    let currentPath = this.sources.path;
    let id          = req.body.destId;
    let entry       = this.sources.findById(id);
    let destPath    = (id == '..') ? '..' : (entry && entry.basename);
    let newPath     = destPath && Path.join(currentPath, destPath);

    if (newPath && this.sources.setPath(newPath)) {
      this.sources.once('read', () => {
        Log.debug(`${TAG}#update> sources changed to destId=${req.body.destId}`);
        res.send(this._getData(req.url));
      });
    } else {
      this.sources.setPath(currentPath);
      res.sendStatus(404);
    }
  }

  show(req, res) {
    Log.debug(`${TAG}#show> ip=${req.connection.remoteAddress}> id=${req.params.id}`);
    let entry = this.sources.findById(req.params.id);

    if (entry) {
      res.send(this._getEntryData(entry, req.url));
    } else {
      Log.warn(`${TAG}#show> source ${req.params.id} not found`);
      res.status(404).send('Not Found');
    }
  }

  download(req, res) {
    Log.debug(`${TAG}#download> ip=${req.connection.remoteAddress}> id=${req.params.id} ext=${req.params.ext}`);
    let entry = this.sources.findById(req.params.id);
    let ext   = req.params.ext;

    if (entry) {
      this.mediator.getPath(entry, req.params.ext)
        .then(path => {
          res.sendFile(path);
        })
        .catch(error => {
          Log.error(`${TAG}#download> id=${req.params.id} ext=${ext}> ${error}`);
          res.sendStatus(500);
        });
    } else {
      Log.warn(`${TAG}#download> source ${req.params.id} not found`);
      res.sendStatus(404);
    }
  }

}

module.exports = SourcesApi;
