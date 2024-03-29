# ColorRefinementList Widget

🎥  **[See it Live on CodeSandbox](https://codesandbox.io/s/n047017lp)**

## Demo

![Demo of ColorRefinementList Widget](https://cl.ly/4838899d5b06/Screen%20Recording%202019-04-10%20at%2011.37%20AM.gif)

## Description

This is the `ColorRefinementList` Labs widget for [React InstantSearch](https://community.algolia.com/react-instantsearch/). You can use this widget to refine results by color tags with Algolia.

This widget displays the colors of the formated facet. The facet value should have a title and hex code separated by a ';' (Eg. `black;#000`)

This helps the user quickly visualise the kind of color that you have in your index.
This is a great widget to refine records within multiple shades of a single color (like choosing the color of a jean).

**Table of Contents**

* [Get the code](#get-the-code)
  * [JavaScript](#javascript)
  * [CSS](#css)
* [Usage](#usage)
  * [Requirements](#requirements)
* [API](#api)
  * [relevanceWidget(opts)](#relevancewidgetopts)
* [Examples](#examples)
* [Implementation details](#implementation-details)
* [Contributing](#contributing)

## Get the code

This widget comes with JavaScript but also pre-defined CSS.

### JavaScript

You can copy and paste the JavaScript code from the repository itself, grab it in the [src/lib](src/lib) folder and use the `<ColorRefinementList />` component.

### CSS

You can copy and paste the necessary CSS code from the repository itself, grab it in [src/lib/ColorRefinementList.css](src/lib/ColorRefinementList.css).

## Usage

Install it with `yarn add @algolia/react-instantsearch-widget-color-refinement-list` then, use it as simply as:

```jsx
import { InstantSearch, Panel } from 'react-instantsearch-dom';
import { ColorRefinementList } from '@algolia/react-instantsearch-widget-color-refinement-list';

<InstantSearch
    appId="..."
    apiKey="..."
    indexName="..."
>
    <Panel header="...">
        <ColorRefinementList
            attribute="..."
        />
    </Panel>
</InstantSearch>
```

### Requirements

You should encapsulate the `<ColorRefinementList/>` component inside a `<Panel/>` and in an `<InstantSearch/>` one.

To work properly, **you'll need to specify the record attribute corresponding to the color**:

### Props

| Name                              | Type      | Use                                                 |
| --------------------------------- | --------- | --------------------------------------------------- |
| attribute (required)              | string    | Name of the attribute that contains the color       |
| limit                             | number    | Number of colors to display                         |
| showMore                          | boolean   | Display show more button                            |


Please note that the records' color attributes need to be formatted like `grey;#eaeaea` (color name and hexadecimal color separated by a semicolon) for the widget to work.

## Implementation details

This widget is implemented using the [`connectRefinementList()` connector](https://www.algolia.com/doc/api-reference/widgets/refinement-list/react/). To learn more about connectors, you can read the associated [guide](https://community.algolia.com/react-instantsearch/guide/Connectors.html).

## Contributing

To contribute to the project, clone this repository then run:

```sh
yarn
yarn start
```
