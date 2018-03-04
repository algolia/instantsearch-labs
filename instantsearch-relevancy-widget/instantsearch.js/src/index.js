/* global instantsearch */

import './index.css';

const search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
  searchParameters: {
    hitsPerPage: 8
  }
});

// Extending the instantsearch.widgets namespace, like regular widgets
instantsearch.widgets.customRankingInfo = function customRankingInfo({
  container
}) {
  // container should be a CSS selector, so we convert it into a DOM element
  container = document.querySelector(container);
  return {
    // Method called at startup, to configure the Algolia settings
    getConfiguration() {
      return {
        // since ranking info isn't returned by default, we'll add it to the config here
        getRankingInfo: true
      };
    },
    // Called whenever we receive new results from Algolia
    render({ results }) {
      let searchHits = container.querySelectorAll('.ais-hits--item');
      // check to see if ranking info container already exists in the hit & remove it to avoid duplicates
      searchHits.forEach((hit, i) => {
        if (hit.querySelector('.hit-ranking-info')) {
          hit.querySelector('.hit-ranking-info').remove();
        }
        // add an id to each hit so we can target them later
        hit.id = `hit-${i}`;
      });

      // create html that will contain ranking info
      results.hits.forEach((hit, i) => {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'hit-ranking-info';
        const trophy = document.createElement('span');
        trophy.innerText = '🏆';
        resultsContainer.appendChild(trophy);
        let resultsUl = document.createElement('ul');
        const rankingHtml = Object.entries(hit._rankingInfo).map(
          ([key, val]) => {
            return `<li><span>${key}: </span> <span>${val}</span></li>`;
          }
        );
        resultsUl.innerHTML = rankingHtml.join('');
        resultsContainer.appendChild(resultsUl);
        // append ranking results to hit
        container.querySelector(`#hit-${i}`).appendChild(resultsContainer);
      });
    }
  };
};

search.addWidget(
  instantsearch.widgets.hits({
    container: document.querySelector('#products'),
    templates: {
      item: '{{{_highlightResult.name.value}}}'
    }
  })
);

search.addWidget(
  instantsearch.widgets.customRankingInfo({
    container: '#products'
  })
);

search.addWidget(
  instantsearch.widgets.searchBox({
    container: document.querySelector('#searchBox'),
    placeholder: 'Search for products',
    autofocus: false /* Only to avoid live preview taking focus */
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: document.querySelector('#brand'),
    attributeName: 'brand'
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: document.querySelector('#pagination')
  })
);

search.start();
