var FS   = require('mz/fs');
var Path = require('path');
var Log  = require('electron-log');

var TAG  = 'api/sources.js';

var Sources = function (App) {

  return {

    index: function (req, res) {
      Log.debug(`${TAG}/index> ip=${req.connection.remoteAddress}> ${App.sources.length} sources`);
      res.send(App.sources.map(source => {
        return {
          id  : source.id,
          name: source.name,
          url : req.url + '/' + source.id
        };
      }).sort());
    },

    show: function (req, res) {
      Log.debug(`${TAG}/show> ip=${req.connection.remoteAddress}> id=${req.params.id}`);
      var source = App.sources.findById(req.params.id);

      if (source) {
        res.send({
          id     : source.id,
          name   : source.name,
          url    : req.url,
          fileurl: req.url + '.pdf',
        });
      } else {
        Log.warn(`${TAG}/show> source ${req.params.id} not found`);
        res.status(404).send('Not Found');
      }
    },

    download: function (req, res) {
      Log.debug(`${TAG}/download> ip=${req.connection.remoteAddress}> id=${req.params.id}`);
      var source = App.sources.findById(req.params.id);

      if (source) {
        source.ensurePdfExists({force: true})
          .then(function (pdfPath) {
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);
          })
          .catch(error => {
            Log.error(`${TAG}/download> source ${req.params.id}> ${error}`);
            res.sendStatus(500);
          });
      } else {
        Log.warn(`${TAG}/download> source ${req.params.id} not found`);
        res.sendStatus(404);
      }
    }

  };

};

module.exports = Sources;
