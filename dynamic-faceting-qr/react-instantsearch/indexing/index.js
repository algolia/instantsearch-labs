const algoliasearch = require('algoliasearch');
const fetch = require('node-fetch');
const chunk = require('lodash/chunk');
require('dotenv').config();

const appId = process.env.REACT_APP_ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;
const indexName = process.env.REACT_APP_ALGOLIA_INDEX_NAME;

async function main() {
  const client = algoliasearch(appId, apiKey);
  const index = client.initIndex(indexName);

  const source =
    'https://cdn.rawgit.com/algolia/datasets/master/ecommerce/bestbuy_seo.json';

  const data = await fetch(source).then(res => res.json());

  console.log('data fetched', data.length);

  const chunks = chunk(data);

  await Promise.all(chunks.map(chunk => index.saveObjects(chunk)));
  console.log('data indexed');

  await index.setSettings({
    searchableAttributes: [
      'name',
      'shortDescription',
      'manufacturer',
      'categories',
    ],
    attributesForFaceting: ['categories', 'type', 'manufacturer', 'salePrice'],
    customRanking: ['desc(bestSellingRank)'],
  });

  console.log('basic settings set');

  const dynamicFacets = [
    {
      query: 'iphone',
      facets: [
        { attribute: 'categories', widgetName: 'RefinementList' },
        { attribute: 'type', widgetName: 'Menu' },
      ],
      objectID: 'dynamic_query_iphone',
    },
    {
      query: 'smartphone',
      facets: [
        { attribute: 'manufacturer', widgetName: 'Menu' },
        { attribute: 'salePrice', widgetName: 'RangeInput' },
      ],
      objectID: 'dynamic_query_smartphone',
    },
  ];

  await index.batchRules(
    dynamicFacets.map(({ objectID, query, facets }) => ({
      condition: {
        pattern: query,
        anchoring: 'contains',
      },
      consequence: {
        userData: {
          type: 'dynamic_facets',
          facets,
        },
      },
      objectID,
    }))
  );

  console.log('rules added');
}

main();
