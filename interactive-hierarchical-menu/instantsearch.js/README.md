# Interactive Hierarchical Menu

🎥 **[See it live on CodeSandbox](https://codesandbox.io/s/github/algolia/instantsearch-labs/tree/master/example/instantsearch.js).**

## Demo

![Demo](https://cl.ly/7f65089a711b/download/Screen%20Recording%202019-02-19%20at%2003.52%20PM.gif)

## Description

The Interactive Hierarchical Menu widget shows a list of refinements represented as a tree.
Only the leaves at a specific level are shown, which is different from the regular [hierarchical menu](https://www.algolia.com/doc/api-reference/widgets/hierarchical-menu/js/) where the whole tree is visible.
Also, the widget supports the facets values without separators.

**Table of Contents**

## Get the code

### JavaScript

Download the `src/index.js` file and link it to your html page.

```html
<script src="src/index.js" | typ="text/javascript"></script>
```

### CSS

Pretty basic CSS code is present in the file `src/index.css`. Just download it and link it to your html page.

```html
<link rel="stylesheet" | typ="text/css" href="src/index.css" />
```

## Usage

After your file is linked to your html page, call `new customAlgolia.InteractiveHierarchicalMenu` with the relevant arguments.
The available arguments are described in the [API](#API) section.

## Requirements

You'll need to have instantsearch [initialized](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/) in your page.

## Examples

```js
search.addWidget(
  new customAlgolia.InteractiveHierarchicalMenuWidget({
    container: '#breadcrumb',
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
      'hierarchicalCategories.lvl3',
    ],
    showMoreLimit: 8,
    transformItems: item => {
      const splittedFacetName = item.split(' > ')
      return splittedFacetName[splittedFacetName.length - 1]
    },
    text: {
      showMore: 'Show more...',
      previous: '&nbsp;',
    },
  })
)
```

## API

### Available arguments

| name            | required | type                  | description                                                                     |
| --------------- | -------- | --------------------- | ------------------------------------------------------------------------------- |
| container       | yes      | string \| HTMLElement | The CSS Selector or HTMLElement to insert the widget into.                      |
| attributes      | yes      | string[]              | The name of the attributes to generate the menu with.                           |
| showMore        | no       | boolean               | Whether to display a button that expands the number of items.                   |
| showMoreLimit   | no       | number                | The maximum number of displayed items (only used when showMore is set to true). |
| separator       | no       | string                | The level separator used in the records.                                        |
| rootPath        | no       | string                | Label that will be shown if no level has been selected.                         |
| showParentLevel | no       | boolean               | Shows parent level in the breadcrumb.                                           |
| cssClasses      | no       | object                | Description below.                                                              |
| transformItems  | no       | function              | Function that will format the facets values.                                    |

### CSS Classes

| name             | description                |
| ---------------- | -------------------------- |
| returnButton     | the previous button        |
| titleWrapper     | wrapper for the breadcrumb |
| rootTitleWrapper | wrapper for the breadcrumb |
| list             | items container            |
| item             | a facet value              |
| showMoreLink     | the show more link         |

## Implementation details

## Contributing
