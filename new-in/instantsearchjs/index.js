/* global instantsearch */
var moment = require('moment');

const search = instantsearch({
  appId: '03RRWC660B',
  apiKey: 'fbd0a83ab82cfdc4c4d22b0145b35d45',
  indexName: 'new_in_demo',
  searchParameters: {
    hitsPerPage: 6,
  },
});

const hitTemplate =
  '<article class="hit">' +
      '<div class="product-picture-wrapper">' +
        '<div class="product-picture"><img src="{{image}}" /></div>' +
      '</div>' +
      '<div class="product-desc-wrapper">' +
        '<div class="product-name">{{{_highlightResult.name.value}}}</div>' +
        '<div class="product-type">{{{_highlightResult.type.value}}}</div>' +
        '<div class="product-price">${{price}}</div>' +
        '<div class="product-price">Posted {{timeAgo}}.</div>' +
      '</div>' +
  '</article>';

search.addWidget(
  instantsearch.widgets.hits({
    container: document.querySelector('#products'),
    transformData: item => {
      var out = {}
      Object.keys(item).forEach(key => out[key] = item[key])
      out.timeAgo = moment(item.date_created).fromNow()
      return out
    },
    templates: {
      item: hitTemplate
    },
  })
);

search.start();
