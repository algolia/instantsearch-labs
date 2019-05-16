# RheostatRangeSlider Widget

🎥  **[See it Live on CodeSandbox](https://codesandbox.io/s/xw4l28v9p)**

## Demo

![Demo of RheostatRangeSlider Widget](https://d2ddoduugvun08.cloudfront.net/items/2z0c0q1H2z3w021L3Q38Screen%20Recording%202019-04-29%20at%2011.29%20AM.gif)

## Description

This is the `RheostatRangeSlider` Labs widget for [React InstantSearch](https://community.algolia.com/react-instantsearch/). You can use this widget to refine results using numerical range with Algolia.

This helps the user quickly refine results using a numerical range.
This is a great widget to refine by price, number of person...

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

You can copy and paste the JavaScript code from the repository itself, grab it in the [src/lib](src/lib) folder and use the `<RheostatRangeSlider />` component.

### CSS

You can copy and paste the necessary CSS code from the repository itself, grab it in [src/lib/RheostatRangeSlider.css](src/lib/RheostatRangeSlider.css).

## Usage

Install it with `yarn add instantsearch-rheostat-range-slider-react` then, use it as simply as:

```jsx
import { InstantSearch, Panel } from 'react-instantsearch-dom';
import RheostatRangeSlider from 'instantsearch-rheostat-range-slider-react';

<InstantSearch
    appId="..."
    apiKey="..."
    indexName="..."
>
    <Panel header="...">
        <RheostatRangeSlider
            attribute="..."
        />
    </Panel>
</InstantSearch>
```

### Requirements

You should encapsulate the `<RheostatRangeSlider/>` component inside a `<Panel/>` and in an `<InstantSearch/>` one.

### Props

| Name                              | Type      | Use                                                 |
| --------------------------------- | --------- | --------------------------------------------------- |
| attribute (required)              | string    | Attribute to use for range slide (Has to be a facet)|

## Implementation details

This widget is implemented using the [`connectRange()` connector](https://www.algolia.com/doc/api-reference/widgets/refinement-list/react/). To learn more about connectors, you can read the associated [guide](https://community.algolia.com/react-instantsearch/guide/Connectors.html).

## Contributing

To contribute to the project, clone this repository then run:

```sh
yarn
yarn start
```
