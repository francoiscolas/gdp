var FS   = require('mz/fs');
var Path = require('path');

var Sources = module.exports = function (App) {

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
        source.getSlides()
          .then(slides => {
            res.send({
              id    : source.id,
              name  : source.name,
              pages: slides.map((slide, index) => req.url + '/' + index + '.jpg').sort()
            });
          })
          .catch(() => {
            res.status(500).send('Internal Server Error');
          });
      } else {
        res.status(404).send('Not Found');
      }
    },

    slide: function (req, res) {
      var source = App.sources.findById(req.params.id);
      var i      = +req.params.i;

      if (source) {
        source.getSlides()
          .then(slides => {
            var is;

            if (i < 0 || i >= slides.length)
              return Promise.reject();

            res.setHeader('Content-Type', 'image/jpeg');
            is = FS.createReadStream(slides[i]);
            is.pipe(res);
          })
          .catch(error => {
            res.status(500).send('Internal Server Error');
          });
      } else {
        res.status(404).send('Not Found');
      }
    }

  };

};
