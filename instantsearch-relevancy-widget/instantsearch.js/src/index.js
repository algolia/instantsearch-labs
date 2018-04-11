/* global instantsearch */

import './index.css';
import relevancyWidget from './relevancyWidget';

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
    container: document.querySelector('#products'),
    templates: {
      item: '{{{_highlightResult.name.value}}}',
    },
  })
);

search.addWidget(relevancyWidget());

search.addWidget(
  instantsearch.widgets.searchBox({
    container: document.querySelector('#searchBox'),
    placeholder: 'Search for products',
    autofocus: false /* Only to avoid live preview taking focus */,
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: document.querySelector('#brand'),
    attributeName: 'brand',
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: document.querySelector('#pagination'),
  })
);

search.start();
