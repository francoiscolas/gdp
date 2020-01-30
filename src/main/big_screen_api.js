'use strict';

let _  = require('lodash');
let FS = require('fs');

let MD5 = function (text) {
  return require('crypto').createHash('md5').update(text).digest('hex');
};

class BigScreenApi {

  constructor(bigScreen) {
    this.bigScreen = bigScreen;
  }

  getData(rootUrl) {
    return {
      bgColor: this.bigScreen.bgColor,
      bgImage: (this.bigScreen.bgImage) ? rootUrl + '/bgImage?' + MD5(this.bigScreen.bgImage) : null,
      sourceId: this.bigScreen.sourceId,
      sourceData: this.bigScreen.sourceData,
    };
  }

  show(req, res) {
    res.send(this.getData(req.url));
  }

  bgImage(req, res) {
    var filepath = this.bigScreen.bgImage;

    FS.stat(filepath, function (error, stats) {
      if (error) {
        res.status(404).send('Not Found');
      } else {
        var is;

        res.setHeader('Content-Length', stats.size);
        is = FS.createReadStream(filepath);
        is.pipe(res);
      }
    });
  }

  update(req, res) {
    this.bigScreen.set({
      sourceId: _.get(req.body, 'sourceId', this.bigScreen.sourceId),
      sourceData: _.get(req.body, 'sourceData', this.bigScreen.sourceData),
    });
    res.send(this.getData(req.url));
  }

  clear(req, res) {
    this.bigScreen.set({
      sourceId: null,
      sourceData: null,
    });
    res.send(this.getData(req.url));
  }

}

module.exports = BigScreenApi;
