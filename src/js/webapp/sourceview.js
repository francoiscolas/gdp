var SourceView = Backbone.View.extend({

  template: _.template(
      '<% if (source) { %>'
    +   '<h5><%= source.name %></h5>'
    + '<% } %>'
    + '<div class="source-actions">'
    +   '<button class="small button previous"><i class="fi-arrow-left"></i></button>'
    +   '<button class="small button" disabled>'
    +     '<%'
    +     'if (source && source.pages.length) {'
    +       'print(currentPage + 1 + "/" + source.pages.length);'
    +     '} else {'
    +       'print("-/-");'
    +     '}'
    +     '%>'
    +   '</button>'
    +   '<button class="small button next"><i class="fi-arrow-right"></i></button>'
    +   '<button class="small button close"><i class="fi-x"></i></button>'
    + '</div>'
    + '<div class="source-preview" style="background-color:<%= display.bgColor %>;background-image:url(<%= display.bgImage %>);">'
    +   '<%'
    +   'if (source) {'
    +     'if (source.pages.length == 0) {'
    +       'print("<div class=\\"loading-anim\\"></div>");'
    +     '} else {'
    +       'for (var i = 0; i < source.pages.length; ++i)'
    +         'print("<div><div class=\\"source-page\\" style=\\"background-image:url(" + source.pages[i] + ");\\"></div></div>");'
    +     '}'
    +   '}'
    +   '%>'
    + '</div>'
  ),

  events: {
    'click button.previous': 'backward',
    'click button.next'    : 'forward',
    'click button.close'   : 'close',
  },

  initialize: function (options) {
    this.display = options.display;
    this.source = null;
    this.currentPage = 0;
    this.slider = null;
    this.listenTo(this.display, 'change:bgColor', this.render);
    this.listenTo(this.display, 'change:bgImage', this.render);
  },

  render: function () {
    if (this.slider) {
      this.slider.slick('unslick');
      this.slider = null;
    }

    this.$el.html(this.template({
      display    : this.display.attributes,
      source     : this.source && this.source.attributes,
      currentPage: this.currentPage
    }));

    this.slider = this.$('.source-preview').slick({
      arrows: false,
      infinite: true,
      slidesToShow: 1
    });
    this.slider.on('afterChange', _.bind(function (slick, current) {
      this.setCurrentPage(current.currentSlide);
    }, this));
    this.slider.slick('goTo', this.currentPage);

    return this;
  },

  backward: function () {
    this.setCurrentPage(this.currentPage - 1);
  },

  forward: function () {
    this.setCurrentPage(this.currentPage + 1);
  },

  close: function () {
    this.setSource(null);
  },

  setSource: function (source) {
    if (this.source) {
      this.stopListening(this.source);
    }

    this.source = source;
    this.currentPage = 0;

    if (this.source) {
      this.source.fetch();
      this.listenTo(this.source, 'change', this.render);
    }

    this.render();
  },

  setCurrentPage: function (page) {
    var count = this.source.get('pages').length;

    if (page < 0)
      this.currentPage = count - 1;
    else if (page >= count)
      this.currentPage = 0;
    else
      this.currentPage = page;
    this.$('button[disabled]').text(
      this.currentPage + 1 + '/' + this.source.get('pages').length
    );
    this.slider.slick('goTo', this.currentPage);
  }

});
