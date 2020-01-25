var _  = require('lodash');
var FS = require('fs');

var MD5 = function (text) {
  return require('crypto').createHash('md5').update(text).digest('hex');
};

function Display(App) {

  var send = function (res) {
    res.send(data());
  };

  var data = function () {
    return {
      bgColor: App.display.bgColor,
      bgImage: (App.display.bgImage) ? '/api/display/bgImage?' + MD5(App.display.bgImage) : null,
      sourceId: App.display.sourceId,
      sourcePage: App.display.sourcePage,
    };
  };

  return {

    show: function (req, res) {
      send(res);
    },

    bgImage: function (req, res) {
      var filepath = App.display.bgImage;

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
    },

    getData: function () {
      return data();
    },

  };

};

module.exports = Display;
