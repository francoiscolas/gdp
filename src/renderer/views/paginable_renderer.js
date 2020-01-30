'use strict';

let $        = require('jquery');
let Renderer = require('./renderer');

let PaginableRenderer = Renderer.extend({

  initialize: function (options) {
    Renderer.prototype.initialize.apply(this, arguments);

    if (options instanceof PaginableRenderer) {
      this.page = options.page;
      this.pageCount = options.pageCount;
    } else {
      this.page = 1;
      this.pageCount = 0;
    }
  },

  getActions: function () {
    let actions = Renderer.prototype.getActions.apply(this, arguments);

    if (!this.$prevBtn) {
      this.$prevBtn = $(`
        <button class="button previous">
          <i class="fas fa-arrow-left"></i>
        </button>
      `).on('click', this.backward.bind(this));
    }
    if (!this.$pageBtn) {
      this.$pageBtn = $('<button class="button page" disabled></button>');
    }
    if (!this.$nextBtn) {
      this.$nextBtn = $(`
        <button class="button next">
          <i class="fas fa-arrow-right"></i>
        </button>
      `).on('click', this.forward.bind(this));
    }
    return actions.concat(this.$prevBtn, this.$pageBtn, this.$nextBtn);
  },

  getData: function () {
    return {
      ...Renderer.prototype.getData.apply(this, arguments),
      page: this.page,
    };
  },

  setData: function (data) {
    this.page = data && data.page;
  },

  render: function () {
    Renderer.prototype.render.apply(this, arguments);

    if (this.$pageBtn)
      this.$pageBtn.text((this.pageCount) ? this.page + '/' + this.pageCount : '');
    return this;
  },

  backward: function () {
    this.setPage(this.page - 1);
  },

  forward: function () {
    this.setPage(this.page + 1);
  },

  setPage: function (page) {
    if (page <= 0)
      this.page = this.pageCount;
    else if (page > this.pageCount)
      this.page = 1;
    else
      this.page = page;
    this.trigger('change');
    this.render();
  },

  setPageCount: function (count) {
    this.pageCount = count;
  },

});

module.exports = PaginableRenderer;
