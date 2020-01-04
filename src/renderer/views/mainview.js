"use strict";

let _                = require('lodash');
let $                = require('jquery');
let Backbone         = require('backbone');
let Display          = require('../models/display');
let DisplayView      = require('./displayview');
let ListView         = require('./listview');
let PreviewView      = require('./previewview');
let SourceCollection = require('../collections/sourcecollection');

require('../lib/jquery.autocomplete');
require('../lib/mousetrap');

let rmAccents = function (str) {
  var accents = {
    "á": "a",
    "à": "a",
    "â": "a",
    "ä": "a",
    "ç": "c",
    "é": "e",
    "è": "e",
    "ê": "e",
    "ë": "e",
    "î": "i",
    "ï": "i",
    "ô": "o",
    "ö": "o",
    "ù": "u",
    "û": "u",
    "ü": "u",
    "Â": "A",
    "Ä": "A",
    "À": "A",
    "Ç": "C",
    "Ê": "E",
    "Ë": "E",
    "É": "E",
    "È": "E",
    "Î": "I",
    "Ï": "I",
    "Ô": "O",
    "Ö": "O",
    "Û": "U",
    "Ü": "U",
    "Ù": "U"
  }

  for (var c in accents)
    str = str.replace(c, accents[c])
  return str
}

let MainView = Backbone.View.extend({

  el: '#app',

  events: {
    'click button.publish': 'publish'
  },

  template: _.template(`
    <div class="column is-one-quarter hero is-fullheight" id="sources-panel">
      <div id="sources-search">
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Recherche (ALT+R) ...">
          <span class="icon is-left">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
      <div id="sources-list"></div>
    </div>
    <div class="column" id="test"></div>
    <div class="column" id="display"></div>
  `),

  initialize: function () {
    this.$el.addClass('main')
    this.$el.html(this.template())

    this.display = new Display()
    this.display.fetch()

    this.sources = new SourceCollection()
    this.sources.fetch()
    setInterval(_.bind(this.sources.fetch, this.sources), 5000)

    this.testView = new PreviewView({
      el: '#test',
      display: this.display 
    })

    this.displayView = new DisplayView({
      el: '#display',
      display: this.display 
    })

    this.listView = new ListView({
      el: 'div#sources-list',
      collection: this.sources
    })
    this.listView.on('activated', this.testView.setSource, this.testView)

    this.$input = this.$('input[type=text]')
    this.$input.val('').autocomplete({
      lookup: _.bind(this._acLookup, this),
      formatResult: _.bind(this._acFormatResult, this),
      onSelect: _.bind(this._acOnSelect, this)
    })
    Mousetrap.bind('alt+r', _.bind(function () {
      this.$input.focus().select()
    }, this))

    $(window).on('resize.' + this.cid, _.bind(this.updateSize, this))
  },

  remove: function () {
    Backbone.View.prototype.remove.apply(this, arguments)

    $(window).off('resize.' + this.cid)
    return this
  },

  render: function () {
    this.testView.render()
    this.displayView.render()
    this.listView.render()
    this.updateSize()
    return this
  },

  publish: function () {
    this.displayView.setSource(this.testView.source)
  },

  updateSize: function () {
    var views    = $([this.testView.el, this.displayView.el]);
    var height   = $(window).height()// - $('#source-search').outerHeight()
    var portrait =
      $(window).height() > $(window).width() || $(window).width() <= 555

//    // FIXME
//    if (portrait && Foundation.MediaQuery.current == 'small') {
//      views
//        .height(height / 2)
//        .parent().addClass('small-portrait')
//    } else {
      //views.height(height)
//    }
  },

  _acLookup: function (query, done) {
    var suggestions = []

    query = rmAccents(query).toLowerCase()
    this.sources.forEach(function (source) {
      var name = source.get('name')

      if (rmAccents(name).toLowerCase().includes(query))
        suggestions.push({value: name, data: source})
    })
    done({suggestions: suggestions})
  },

  _acFormatResult: function (suggestion, query) {
    if (!query) {
      return suggestion.value
    } else {
      var query = rmAccents(query).toLowerCase()
      var value = rmAccents(suggestion.value).toLowerCase()
      var part  = suggestion.value.substr(value.indexOf(query), query.length)
      return suggestion.value.replace(part, '<strong>' + part + '</strong>')
    }
  },

  _acOnSelect: function (suggestion) {
    this.testView.setSource(suggestion.data)
    this.$input.val('')
  },

})

module.exports = MainView
