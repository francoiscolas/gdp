//=include lib/jquery-fix.js
//=include lib/jquery.js
//=include lib/underscore.js
//=include lib/backbone.js

$(function () {

  var normalize = function (path) {
    var OS = require('os');

    if (OS.platform() == 'win32')
      return path.replace(/\\/g, '/');
    return path;
  };

  var AppView = Backbone.View.extend({

    el: 'body',

    settings: null,

    sources: null,

    render: function () {
      if (this.settings && this.sources) {
        var source = this.sources.findById(this.settings.sourceId);

        this.$el.css('background-color', this.settings.bgColor);
        if (source) {
          source.getSlides().then(slides => {
            var bgImage = normalize(slides[this.settings.sourcePage]);
            this.$el.css('background-image', `url("${bgImage}")`);
          });
        } else {
          var bgImage = normalize(this.settings.bgImage);
          this.$el.css('background-image', `url("${bgImage}")`);
        }
      }
    },

    setSettings: function (settings) {
      this.settings = settings;
      this.render();
    },

    setSources: function (sources) {
      this.sources = sources;
      this.render();
    }

  });

  var App;
  var View;
  
  App = require('electron').remote.getGlobal('App');
  App.on('launched', function () {
    View.setSettings(App.display);
    View.setSources(App.sources);
    App.display.on('change', function () {
      View.render();
    });
  });

  View = window.View = new AppView();
  View.render();

});
