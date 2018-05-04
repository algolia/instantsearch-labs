## Smart category widgets

Based on the [instant search demo](https://github.com/algolia/instant-search-demo/). Display category suggestions based on a query entered in the search bar.

If results are concentrated inside one category, then the widget will attempt to suggest categories inside it recursively until an acceptable spread is found.

### Getting started

1. `yarn` or `npm install` to install dependencies
2. `yarn run start` or `npm run start` to start the app
3. visit `localhost:3000` to play with the demo!

### Overview

The smart categories widget uses [hierarchal facets](https://community.algolia.com/algoliasearch-helper-js/reference.html#hierarchical-facets)) to display relevant category suggestions based on a spread of results. It is based on a blog post [looking at how Etsy displayed category suggestions](https://codeascraft.com/2015/08/31/how-etsy-uses-thermodynamics-to-help-you-search-for-geeky/).

### Thermodynamic Entropy

Smart category uses entropy to decide what level of results to show. Entropy can be considered the amount of _order_ (or _disorder_) in a system. We can leverage this to see how well spread results are. Results with a high amount of order, can be considered to be well spread, conversely results that exist mostly in a single facet could be considered disordered.

The shannon entropy formula is used to assign logarithmic value to the spread of results. A boundary is set above which the spread is consider too large and category suggestions are displayed from the next level down.

### How it works

#### Retriving the data

The widget uses a derived version of the main helper from `instantsearch.js`.

The [derived helper](https://community.algolia.com/algoliasearch-helper-js/concepts.html#derivations-of-the-helper-multi-queries) contains the state of the main helper, however can be modified to make a secondary request, in this case, the derived helper request facet values from each of the hierarchical categories without using hierarchal refinements. It does this by removing hierarchal faceting and replacing it with simple conjunctive faceting.

#### Calculating Results

The widget starts at the base level. It takes all results, and calculates a value for the entropy within that set. If the result of this is below the boundary defined, then categories will be show. If however it is not, the process is repeated until a level is found with sufficient order within it.

If no category reaches the boundary, then the lowest level will be shown.

### Category Images

Images are displayed by making a one time search using distinct set on the lowest level of hierarchicalCategories. This query is performed on init, and an image is select from each record for each category.

It comes with two limitations.

1. The user cannot select which image they would like to appear for each category
2. It is not exhustive as there a large number of results that could be returned and this is a very expensive operation
