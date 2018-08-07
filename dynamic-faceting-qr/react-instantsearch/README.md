# Dynamic Faceting using Query Rules

Prerequisites: Algolia, react-instantsearch, Query Rules, facets

## The goal

We want to add facets only when they are relevant to the search, when there's a manually manageable number of facets to add.

We want to create a interface like [this one](https://preview.algolia.com/dynamic-faceting/) (which is using InstantSearch.js). The code for that interface is [here](https://github.com/algolia/demo-dynamic-faceting).

## The strategy

1.  add all the possible facets to your indexing configuration as regular
2.  add query rules for the situations in which you want certain facets to show up
3.  render the facets decided by the query rule

## Adding facets

This is exactly like normally, but this time you also keep track of which facets are possible. Here I've started from the "ecommerce" dataset provided, and indexed it like in [indexing.js](./indexing/index.js) (run `yarn index` to index to your app).

then we decide which queries (no typo-tolerance) you want these facets to show up. For example:

```js
const dynamicFacets = [
  {
    query: 'iphone',
    facets: [
      { attribute: 'category', widgetName: 'RefinementList' },
      { attribute: 'type', widgetName: 'Menu' },
    ],
    objectID: 'dynamic_query_iphone',
  },
  {
    query: 'smartphone',
    facets: [
      { attribute: 'brand', widgetName: 'Menu' },
      { attribute: 'price', widgetName: 'RangeInput' },
    ],
    objectID: 'dynamic_query_smartphone',
  },
];
```

## Adding query rules

Next we need to transform that list into query rules and add them to the index.

```js
const algoliasearch = require('algoliasearch');
const client = algoliasearch('your_app_id', 'your_admin_api_key');
const index = client.initIndex('your_index');

index
  .batchRules(
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
  )
  .then(console.log);
```

These query rules can also be added via the dashboard. make sure to choose the same options as the ones added here.

## Dynamically displaying facets

In our query rules we made four possible dynamic facets: categories, type, brand, price. We now want to display these in a React InstantSearch app. First let's create a start:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
} from 'react-instantsearch-dom';

const App = () => (
  <InstantSearch
    appId="your_app_id"
    apiKey="your_search_api_key"
    indexName="your_index"
  >
    <SearchBox />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20% 75%',
        gridGap: '5%',
      }}
    >
      <div>We will add dynamic facets here</div>
      <Hits />
    </div>
    <div style={{ textAlign: 'center' }}>
      <Pagination />
    </div>
  </InstantSearch>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

Now we want to create the dynamic facets. We will make a wrapper component which will read the facets to apply from the query rule state:

```js
import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  connectStateResults,
  RefinementList,
  Menu,
  RangeInput,
} from 'react-instantsearch-dom';

const DynamicWidgets = {
  RefinementList,
  Menu,
  RangeInput,
};

class DynamicFacets extends Component {
  static propTypes = {
    limit: PropTypes.number,
    searchState: PropTypes.object,
    searchResults: PropTypes.object,
  };

  static defaultProps = {
    limit: 10,
  };

  render() {
    if (this.props.searchResults && this.props.searchResults.userData) {
      // get the data returned by the query rule
      const uniques = this.props.searchResults.userData
        // only get the dynamic facet type
        .filter(({ type }) => type === 'dynamic_facets')
        // only add one widget per attribute
        .reduce((acc, { facets }) => {
          facets.forEach(({ attribute, widgetName }) =>
            acc.set(attribute, widgetName)
          );
          return acc;
        }, new Map());

      const facets = [...uniques]
        // limit it
        .slice(0, this.props.limit)
        // turn the name of the widget into its value
        .map(([attribute, widgetName]) => ({
          attribute,
          widgetName,
          Widget: DynamicWidgets[widgetName],
        }));

      if (facets.length > 0) {
        return this.props.children({ facets });
      }
    }
    return null;
  }
}

export default connectStateResults(DynamicFacets);
```

This component essentially gives us access to the dynamic facets applying here. We can now make use of these facets and render them where we used to have `<div>We will add dynamic facets here</div>`.

```jsx
<DynamicFacets>
  {({ facets }) =>
    facets.map(({ attribute, widgetName }) => (
      <pre key={attribute}>
        {JSON.stringify({ attribute, widgetName }, null, 2)}
      </pre>
    ))
  }
</DynamicFacets>
```

So what we have now is a component which tells us which widgets to render with which attribute. The next step is to actually render them:

```jsx
<DynamicFacets>
  {({ facets }) =>
    facets.map(({ attribute, Widget }) => (
      <Panel header={attribute} key={attribute}>
        <Widget attribute={attribute} key={attribute} />
      </Panel>
    ))
  }
</DynamicFacets>
```

This gives us a final result of:

[![screenshot](https://codesandbox.io/api/v1/sandboxes/2x0pvzvr8p/screenshot.png)](https://github.com/algolia/instantsearch-labs/tree/master/dynamic-faceting-qr/react-instantsearch)
