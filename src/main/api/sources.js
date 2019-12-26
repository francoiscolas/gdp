var FS   = require('mz/fs');
var Path = require('path');

var Sources = function (App) {

  return {

    index: function (req, res) {
      res.send(App.sources.map(source => {
        return {
          id  : source.id,
          name: source.name,
          url : req.url + '/' + source.id
        };
      }).sort());
    },

    show: function (req, res) {
      var source = App.sources.findById(req.params.id);

      if (source) {
        res.send({
          id     : source.id,
          name   : source.name,
          url    : req.url,
          fileurl: req.url + '.pdf',
        });
      } else {
        res.status(404).send('Not Found');
      }
    },

    download: function (req, res) {
      var source = App.sources.findById(req.params.id);

      if (source) {
        source.ensurePdfExists({force: true})
          .then(function (pdfPath) {
            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);
          })
          .catch(error => {
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(404);
      }
    }

  };

};

module.exports = Sources;
