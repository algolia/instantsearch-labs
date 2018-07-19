/* global instantsearch autocomplete */

const appId = "latency",
  apiKey = "6be0576ff61c053d5f9a3225e2a90f76",
  indexName = "instant_search",
  client = algoliasearch(appId, apiKey),
  suggestionsIndex = client.initIndex("instantsearch_query_suggestions"),
  index = client.initIndex(indexName);


app({
  appId,
  apiKey,
  indexName,
});

// Click handlers for demo settings
$("#timeSelect").change(function (e) {
  app({
    appId,
    apiKey,
    indexName,
    timeDelay: e.target.value,
    nbSuggestions: $("#nbSuggestionsSelect").val()
  })
});

$("#nbSuggestionsSelect").change(function (e) {
  app({
    appId,
    apiKey,
    indexName,
    timeDelay: $("#timeSelect").val(),
    nbSuggestions: e.target.value
  })
});

$("#time-input-button").click(function (e) {
  app({
    appId,
    apiKey,
    indexName,
    timeDelay: $("#time-input").val() * 1000,
    nbSuggestions: e.target.value
  })
});


function app(opts) {
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
  });

  // ---------------------
  //
  //  Default widgets
  //
  // ---------------------

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 10,
      templates: {
        item: $(`#hit-template`).html(),
        empty: $(`#no-results-template`).html()
      },
      transformData: {
        item: function (item) {
          item.starsLayout = getStarsHTML(item.rating);
          item.categories = getCategoryBreadcrumb(item);
          return item;
        },
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

  search.addWidget(
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [{
        name: opts.indexName,
        label: 'Most relevant',
      }, {
        name: `${opts.indexName}_price_asc`,
        label: 'Lowest price',
      }, {
        name: `${opts.indexName}_price_desc`,
        label: 'Highest price',
      }],
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#aa-input-container',
    })
  );

  // ---------------------
  //
  //  Filtering widgets
  //
  // ---------------------

  search.addWidget(
    instantsearch.widgets.hierarchicalMenu({
      container: '#hierarchical-categories',
      attributes: [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2'
      ],
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      showParentLevel: true,
      limit: 10,
      templates: {
        header: '<h5>Category</h5>',
        item: '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{value}}</span class="facet-name"><span class="ais-hierarchical-menu--count">{{count}}</span></a>' // eslint-disable-line
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#brand',
      attributeName: 'brand',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 5,
      operator: 'or',
      showMore: {
        limit: 10,
      },
      searchForFacetValues: {
        placeholder: 'Search for brands',
        templates: {
          noResults: '<div class="sffv_no-results">No matching brands.</div>',
        },
      },
      templates: {
        header: '<h5>Brand</h5>'
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'price',
      tooltips: {
        format: function (rawValue) {
          return `$${Math.round(rawValue).toLocaleString()}`;
        },
      },
      templates: {
        header: '<h5>Price</h5>'
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.priceRanges({
      container: '#price-range',
      attributeName: 'price',
      labels: {
        currency: '$',
        separator: 'to',
        button: 'Apply',
      },
      templates: {
        header: '<h5>Price range</h5>'
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.starRating({
      container: '#stars',
      attributeName: 'rating',
      max: 5,
      labels: {
        andUp: '& Up',
      },
      templates: {
        header: '<h5>Rating</h5>'
      },
      collapsible: {
        collapsed: false,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.toggle({
      container: '#free-shipping',
      attributeName: 'free_shipping',
      label: 'Free Shipping',
      values: {
        on: true,
      },
      templates: {
        header: '<h5>Shipping</h5>'
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'type',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      showMore: true,
      templates: {
        header: '<h5>Type</h5>'
      },
      collapsible: {
        collapsed: true,
      },
    })
  );

  // ---------------------
  //
  //  Custom widgets
  //
  // ---------------------

  const autocompleteWidget = instantsearch.connectors.connectSearchBox(autocompleteRenderFn);

  search.addWidget(
    autocompleteWidget({
      container: '#aa-input-container',
      placeholder: 'Search for products by name, type, brand, ...',
      delayTime: opts.timeDelay,
      nbSuggestions: opts.nbSuggestions,
      suggestionTemplate: function (suggestion, answer) {
        return '<div class="suggestion">' + suggestion._highlightResult.query.value + '</div>'
      },
      suggestionsIndex
    })
  );

  search.start();
}

// ---------------------
//
//  Helper functions
//
// ---------------------

function getCategoryBreadcrumb(item) {
  const highlightValues = item._highlightResult.categories || [];
  return highlightValues.map(category => category.value).join(' > ');
}

function getStarsHTML(rating, maxRating) {
  let html = '';
  maxRating = maxRating || 5;

  for (let i = 0; i < maxRating; ++i) {
    html += `<span class="ais-star-rating--star${i < rating ? '' : '__empty'}"></span>`;
  }
  return html;
}
