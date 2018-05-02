import './relevanceWidget.css';

function relevanceWidget({
  hitsSelector = '.ais-hits--item',
  cssClasses = {
    root: 'ais-relevanceWidget',
  },
} = {}) {
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
      let searchHits = document.querySelectorAll(hitsSelector);

      // create html that will contain ranking info
      results.hits.forEach((hit, hitIndex) => {
        const $mainContainer = document.createElement('div');
        $mainContainer.className = cssClasses.root;
        const $trophy = document.createElement('span');
        $trophy.innerText = '🏆';
        $mainContainer.appendChild($trophy);
        let $rankingInfo = document.createElement('ul');
        const rankingHtml = Object.entries(hit._rankingInfo).map(
          ([key, val]) => {
            return `<li><span>${key}: </span> <span>${val}</span></li>`;
          }
        );
        $rankingInfo.innerHTML = rankingHtml.join('');
        $mainContainer.appendChild($rankingInfo);
        // append ranking results to hit
        console.log(searchHits[hitIndex]);
        searchHits[hitIndex].appendChild($mainContainer);
      });
    },
  };
}

export default relevanceWidget;
