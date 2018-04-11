function relevancyWidget({ container, hitSelector, cssClasses }) {
  container,
    (hitSelector = '.ais-hits--item'),
    (cssClasses = {
      root: 'ais-relevancyWidget',
    });

  {
    // container should be a CSS selector, so we convert it into a DOM element
    container = document.querySelector(container);
    return {
      // Method called at startup, to configure the Algolia settings
      getConfiguration() {
        return {
          // since ranking info isn't returned by default, we'll add it to the config here
          getRankingInfo: true,
        };
      },
      // Called whenever we receive new results from Algolia
      render({ results }) {
        let searchHits = container.querySelectorAll(hitSelector);
        // check to see if ranking info container already exists in the hit & remove it to avoid duplicates
        searchHits.forEach((hit, i) => {
          if (hit.querySelector(`.${cssClasses.root}`)) {
            hit.querySelector(`.${cssClasses.root}`).remove();
          }
          // add an id to each hit so we can target them later
          hit.id = `hit-${i}`;
        });

        // create html that will contain ranking info
        results.hits.forEach((hit, i) => {
          const resultsContainer = document.createElement('div');
          resultsContainer.className = cssClasses.root;
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
      },
    };
  }
}

export default relevancyWidget;
