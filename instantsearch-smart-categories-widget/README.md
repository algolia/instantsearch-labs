## Smart category widgets

* [Overview](#overview)
* [Getting started](#getting-started)
* [Settings](#settings)
* [Thermodynamic Entropy](#thermodynamic-entropy)
* [How it works](#how-it-works)
* [Category Images](#category-images)

### Overview

The smart categories widget uses hierarchal facets to display relevant category suggestions based on a spread of results.

If results are concentrated inside one category, then the widget will attempt to suggest categories inside it recursively until an acceptable spread is found.

It is based on a blog post by developers at Etsy; [Looking at how Etsy displayed category suggestions](https://codeascraft.com/2015/08/31/how-etsy-uses-thermodynamics-to-help-you-search-for-geeky/).

### Getting started

#### The old school way

1. Add `widget-smart-categories.js` and `widget-smart-categories.css` to your project

```html
<link rel="stylesheet" type="text/css" href='widget-smart-categories.css' />
<script type="text/javascript" src='widget-smart-categories.js'></script>
```

1. Add a target div for the widget

```html
<div id="smart-categories"></div>
```

2. Create a new widget with your settings

```js
const smartCategories = SmartCategoriesWidget({
  hierarchicalCategories: [
    'hierarchicalCategories.level0',
    'hierarchicalCategories.level1',
    'hierarchicalCategories.level2'
  ],
  imageAttributePath: 'image',
  entropyValue: 1.7,
  categoriesToDisplay: 3,
  isInDebug: false,
  containerID: 'smart-categories'
});
```

3. Add the widget to your app

```js
instantSearch.addWidget(entropicCategories);
```

### Settings

| Property                 | Type                 | Description                                                                                                                                                                                                                         |
| ------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hierarchicalCategories` | `Array`              | The fields to use for hierarchical faceting. [See this doc on how to create them](https://www.algolia.com/doc/guides/searching/faceting/#hierarchical-facets)                                                                       |
| `imageAttributePath`     | `String`             | The field where the url to the record can be found                                                                                                                                                                                  |
| `containerID`            | `String`             | The ID of the div where the widget should render                                                                                                                                                                                    |
| `entropyValue`           | (Optional) `Number`  | The value used to dictate when to automatically filter. Any calculated value greater than this causes the widget to display values from the next level [See here for an description on how entropy is used](#thermodynamic-entropy) |
| `categoriesToDisplay`    | (Optional) `Number`  | The amount of categories to display                                                                                                                                                                                                 |
| `isInDebug`              | (Optional) `Boolean` | Display more information about the widget for debug purposes                                                                                                                                                                        |

### Thermodynamic Entropy

Smart category uses entropy to decide what level of results to show. Entropy can be considered the amount of _order_ (or _disorder_) in a system. We can leverage this to see how well spread results are. Results with a high amount of order, can be considered to be well spread, conversely results that exist mostly in a single facet could be considered disordered.

The Shannon entropy formula is used to assign logarithmic value to the spread of results. A boundary is set above which the spread is consider too large and category suggestions are displayed from the next level down.

### How it works

#### Retrieving the data

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
