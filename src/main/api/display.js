var _  = require('lodash');
var FS = require('mz/fs');

var MD5 = function (text) {
  return require('crypto').createHash('md5').update(text).digest('hex');
};

function Display(App) {

  var send = function (res) {
    res.send({
      bgColor: App.display.bgColor,
      bgImage: (App.display.bgImage) ? '/api/display/bgImage?' + MD5(App.display.bgImage) : null,
      sourceId: App.display.sourceId,
      sourcePage: App.display.sourcePage,
    });
  };

  return {

    show: function (req, res) {
      send(res);
    },

    bgImage: function (req, res) {
      var filepath = App.display.bgImage;

      FS.stat(filepath).then(stat => {
        var is;

        res.setHeader('Content-Length', stat.size);
        is = FS.createReadStream(filepath);
        is.pipe(res);
      }).catch(error => {
        res.status(404).send('Not Found');
      });
    },

    update: function (req, res) {
      App.display.set({
        sourceId: _.get(req.body, 'sourceId', App.display.sourceId),
        sourcePage: _.get(req.body, 'sourcePage', App.display.sourcePage),
      });
      send(res);
    },

    clear: function (req, res) {
      App.display.set({
        sourceId: null,
        sourcePage: 0
      });
      send(res);
    }

  };

};

module.exports = Display;
