/* global instantsearch */

const demoSettings = {
  appId: 'VYLEWMPKEZ',
  apiKey: '8940a18fde155adf3f74b0912c267aa4',
  indexName: 'ecommerce-v2',
  hierarchicalCategories: [
    'hierarchicalCategories.lvl0',
    'hierarchicalCategories.lvl1',
    'hierarchicalCategories.lvl2',
  ],
  refinementList: 'brand',
  rangeSlider: 'price',
  priceRanges: 'price',
  starRating: 'rating',
  toggle: 'free_shipping',
  menu: 'type',
};

app({
  appId: demoSettings.appId,
  apiKey: demoSettings.apiKey,
  indexName: demoSettings.indexName,
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  // ---------------------
  //
  //  Init
  //
  // ---------------------
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: false,
    searchFunction: opts.searchFunction,
  });

  // ---------------------
  //
  //  Default widgets
  //
  // ---------------------
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for products by name, type, brand, ...',
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
      transformData: {
        item(item) {
          /* eslint-disable no-param-reassign */
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
      indices: [
        {
          name: opts.indexName,
          label: 'Most relevant',
        },
        {
          name: `${opts.indexName}_price_asc`,
          label: 'Lowest price',
        },
        {
          name: `${opts.indexName}_price_desc`,
          label: 'Highest price',
        },
      ],
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );

  // ---------------------
  //
  //  Filtering widgets
  //
  // ---------------------

  if (demoSettings.hierarchicalCategories.length) {
    search.addWidget(
      instantsearch.widgets.hierarchicalMenu({
        container: '#hierarchical-categories',
        attributes: demoSettings.hierarchicalCategories,
        showParentLevel: true,
        templates: {
          header: getHeader('Category'),
          item:
            '<a href="{{url}}" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{label}}</span class="facet-name"><span class="ais-hierarchical-menu--count">{{count}}</span></a>' // eslint-disable-line
        },
        sortBy: ['count', 'name:desc'],
      })
    );
  }

  if (demoSettings.refinementList.length) {
    search.addWidget(
      instantsearch.widgets.refinementList({
        container: '#brand',
        attributeName: demoSettings.refinementList,
        limit: 5,
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
  }

  if (demoSettings.rangeSlider) {
    search.addWidget(
      instantsearch.widgets.rangeSlider({
        container: '#price',
        attributeName: demoSettings.rangeSlider,
        tooltips: {
          format(rawValue) {
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
  }

  if (demoSettings.priceRanges) {
    search.addWidget(
      instantsearch.widgets.priceRanges({
        container: '#price-range',
        attributeName: demoSettings.priceRanges,
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
  }

  if (demoSettings.starRating) {
    search.addWidget(
      instantsearch.widgets.starRating({
        container: '#stars',
        attributeName: demoSettings.starRating,
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
  }

  if (demoSettings.toggle) {
    search.addWidget(
      instantsearch.widgets.toggle({
        container: '#free-shipping',
        attributeName: demoSettings.toggle,
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
  }

  if (demoSettings.menu) {
    search.addWidget(
      instantsearch.widgets.menu({
        container: '#type',
        attributeName: demoSettings.menu,
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
  }

  search.addWidget(
    SmartCategoriesWidget({
      hierarchicalCategories: [
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
      ],
      imageAttributePath: 'image',
      containerID: 'smart-categories',
      entropyValue: 1.7,
      nbCategoriesToDisplay: 3,
      hasDebugControls: true,
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
  const newRating = maxRating || 5;

  for (let i = 0; i < newRating; ++i) {
    html += `<span class="ais-star-rating--star${
      i < rating ? '' : '__empty'
    }"></span>`;
  }

  return html;
}
