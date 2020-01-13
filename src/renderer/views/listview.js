'use strict'

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

const SUPPORTED_FORMATS = require('../../config/config').formats;

let _iconFor = function (filename) {
  let matches = filename.match(/\.([a-zA-Z0-9]+)$/);
  let type    = '';

  if (matches) {
    let format = SUPPORTED_FORMATS.find(format => format.ext == matches[1]);
    if (format)
      type = format.type;
  }
  return 'fas fa-file-' + type;
};

let ListView = Backbone.View.extend({

  events: {
    'click a': '_onClick'
  },

  template: _.template(`
    <% if (source == '..') { %>
      <a class="item item-dir item-parent-dir">
        <span class="icon">
          <i class="fas fa-caret-square-left"></i>
        </span>
        <span>Dossier parent</span>
      </a>
    <% } else if (source.get('isDir')) { %>
      <a class="item item-dir">
        <span class="icon">
          <i class="fas fa-folder"></i>
        </span>
        <span><%= source.get("name") %></span>
      </a>
    <% } else if (source.get('formats').length == 0) { %>
      <a class="item disabled" title="Non supporté">
        <span class="icon">
          <i class="fas fa-file"></i>
        </span>
        <span><%= source.get("name") %></span>
      </a>
    <% } else { %>
      <a class="item">
        <span class="icon">
          <i class="<%= _iconFor(source.get('name')) %>"></i>
        </span>
        <span><%= source.get("name") %></span>
    <% } %>
  `),

  initialize: function () {
    var sources = this.collection

    this.listenTo(sources, 'reset', this.render)
    this.listenTo(sources, 'add', this.addSource)
    this.listenTo(sources, 'remove', this.removeSource)
  },

  render: function () {
    this.$el.empty()
    this.$el.append(this.template({source: '..', _iconFor: _iconFor}));
    this.collection.each(this.addSource, this)
    return this
  },

  addSource: function (source) {
    var a = this.template({source: source, _iconFor: _iconFor})
    this.$el.append($(a).data('source', source))
  },

  removeSource: function (source) {
    this.$el.find('li').each(function (i, li) {
      var $li = $(li)

      if ($li.data('source').id == source.id)
        $li.remove()
    })
  },

  _onClick: function (event) {
    var $a     = $(event.currentTarget);
    var source = $a.data('source')

    if ($a.not('.disabled'))
      this.trigger('activated', ($a.is('.item-parent-dir')) ? '..' : source)
  }

})

module.exports = ListView
