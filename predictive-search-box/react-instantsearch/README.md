# PredictiveSearchBox Widget

🎥  **[See it Live on CodeSandbox](https://codesandbox.io/s/jn74q5zl19)**

## Demo

![Demo of PredictiveSearchBox Widget](https://cl.ly/b0cdc20009a6/Screen%20Recording%202019-04-15%20at%2001.26%20PM.gif)

## Description

This is the `PredictiveSearchBox` Labs widget for [React InstantSearch](https://community.algolia.com/react-instantsearch/). You can use this widget to perform search and get a list of suggestions at the same time using the [Algolia Query Suggestions](https://www.algolia.com/doc/guides/getting-insights-and-analytics/leveraging-analytics-data/query-suggestions/).

This widget displays a list of suggestion comming from another index than the search one. We advise you to build an Algolia Query Suggestion index.
This guide the user in their search to find relevant keywords within the index.

**Table of Contents**

* [Get the code](#get-the-code)
  * [JavaScript](#javascript)
  * [CSS](#css)
* [Usage](#usage)
  * [Requirements](#requirements)
  * [Props](#props)
* [Implementation details](#implementation-details)
* [Contributing](#contributing)

## Get the code

This widget comes with JavaScript but also pre-defined CSS.

### JavaScript

You can copy and paste the JavaScript code from the repository itself, grab it in the [src/lib](src/lib) folder and use the `<PredictiveSearchBox />` component.

### CSS

You can copy and paste the necessary CSS code from the repository itself, grab it in [src/lib/PredictiveSearchBox.css](src/lib/PredictiveSearchBox.css).

## Usage

Install it with `yarn add instantsearch-predictive-search-box-react` then, use it as simply as:

```jsx
import { InstantSearch, Panel } from 'react-instantsearch-dom';
import PredictiveSearchBox from 'instantsearch-predictive-search-box-react';

<InstantSearch
    appId="..."
    apiKey="..."
    indexName="..."
>
    <PredictiveSearchBox
        translations={{ placeholder: "Search for anything" }}
        suggestionsIndex="..."
        appID="..."
        apiKey="..."
        maxSuggestions={30}
    />
</InstantSearch>
```

### Requirements

You should encapsulate the `<PredictiveSearchBox/>` in an `<InstantSearch/>` one.

To work properly, **you'll need to specify the record attribute corresponding to the color**:

### Props

| Name                              | Type      | Use                                                 |
| --------------------------------- | --------- | --------------------------------------------------- |
| suggestionsIndex (required)       | string    | The name of the suggestion index                    |
| appID (required)                  | string    | The index appID                                     |
| apiKey (required)                 | string    | The app search only api key                         |
| maxSuggestions (required)         | int       | The max number of suggestions to display            |

If you are not using an Algolia Query Suggestion index, keep in mind that your index records need to have the attribute `query`.
Where `query` is the actual suggestion string.

## Implementation details

This widget is implemented using the [`connectSearchBox()` connector](https://www.algolia.com/doc/api-reference/widgets/search-box/react/?language=javascript#connector). To learn more about connectors, you can read the associated [guide](https://community.algolia.com/react-instantsearch/guide/Connectors.html).

## Contributing

To contribute to the project, clone this repository then run:

```sh
yarn
yarn start
```
