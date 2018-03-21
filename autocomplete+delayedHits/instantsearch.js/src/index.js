/* global instantsearch */

/* global instantsearch autocomplete */

const appId = '5NICTDJ5Q3',
apiKey = 'fe2708f4939640ae043e0a04008fbb10',
// latencyAppId = 'latency',
// latencyApiKey = '6be0576ff61c053d5f9a3225e2a90f76',
// latencyClient = algoliasearch(latencyAppId, latencyApiKey),
indexName = 'instant_search',
client = algoliasearch(appId, apiKey),
index = client.initIndex(indexName),
suggestionsIndex = client.initIndex('prefix_query_suggestions');


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
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
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
        header: getHeader('Category'),
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
        header: getHeader('Brand'),
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
        header: getHeader('Price'),
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
        header: getHeader('Price range'),
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
        header: getHeader('Rating'),
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
        header: getHeader('Shipping'),
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
        header: getHeader('Type'),
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


function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}

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



