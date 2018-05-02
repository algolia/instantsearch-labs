/* global instantsearch */

import './index.css';

const search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
  searchParameters: {
    hitsPerPage: 8,
  },
});

search.addWidget(
  instantsearch.widgets.hits({
    container: $('#products'),
    templates: {
      item: '{{{_highlightResult.name.value}}}',
    },
  })
);

search.addWidget(
  instantsearch.widgets.searchBox({
    container: $('#searchBox'),
    placeholder: 'Search for products',
    autofocus: false /* Only to avoid live preview taking focus */,
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: $('#brand'),
    attributeName: 'brand',
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: $('#pagination'),
  })
);

search.start();
