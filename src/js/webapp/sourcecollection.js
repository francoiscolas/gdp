var SourceCollection = Backbone.Collection.extend({

  model: Source,

  url: '/api/sources',

  comparator: 'name',

});
