'use strict'

let _        = require('lodash');
let $        = require('jquery');
let Backbone = require('backbone');

let ListView = Backbone.View.extend({

  events: {
    'click a': '_onClick'
  },

  template: _.template(`
    <a class="item">
      <span class="icon">
        <i class="fas fa-file-powerpoint"></i>
      </span>
      <span><%= source.get("name") %></span>
    </a>
  `),

  initialize: function () {
    var sources = this.collection

    this.listenTo(sources, 'reset', this.render)
    this.listenTo(sources, 'add', this.addSource)
    this.listenTo(sources, 'remove', this.removeSource)
  },

  render: function () {
    this.$el.empty()
    this.collection.forEach(this.addSource, this)
    return this
  },

  addSource: function (source) {
    var a = this.template({source: source})
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
    var source = $(event.currentTarget).data('source')

    if (source)
      this.trigger('activated', source)
  }

})

module.exports = ListView
