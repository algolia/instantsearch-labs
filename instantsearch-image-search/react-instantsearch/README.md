# Picture search

![Demo](https://cl.ly/a3184cfe589c/Screen%20Recording%202018-12-19%20at%2003.32%20PM.gif)

## Demo

See a real-life demo here 👉 https://silly-minsky-fa5fa6.netlify.com.

## Description

Picture search allows users to search for a record from an uploaded image.

Under the hood, it uses Amazon Rekognition API to detect items and text from an image file. When the app performs a search, the detected items are used as filters and the detected text is used as query terms.

**Table of Contents**

- [Get the code](#get-the-code)
  - [JavaScript](#javascript)
  - [CSS](#css)
- [Usage](#usage)
  - [Requirements](#requirements)
- [API](#api)
  - [relevanceWidget(opts)](#relevancewidgetopts)
- [Examples](#examples)
- [Implementation details](#implementation-details)
- [Contributing](#contributing)

## Get the code

This widget comes with JavaScript but also pre-defined CSS.

### JavaScript

The app structure follows the [presentational and container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) concept. You'll find the whole business logic in the `src/containers` folder. The presentational components are in `src/components`. That's also where you'll find the css files.

### CSS

You will find the default css files in `src/components` folder. Each CSS file name matches the association component file name.

## Usage

```jsx
import { InstantSearch } from 'react-instantsearch-dom'
import TagsBox from 'instantsearch-tagsbox-react'

<InstantSearch appId="..." apiKey="..." indexName="...">
  <ImageSearchBox
    filter="_tags"
  />
  {/* render hits somewhere... */}
</InstantSearch>
```

Make sure `InstantSearch` is an ancestor of your component.

### Requirements

You need to provide the url the app is going to hit for analyzing an uploaded picture. Open the `.env` file and fill in the variable `REACT_APP_API_URL`.

### Known limitations

- No styling. Except if you override the CSS classes.
- If you need to change how the uploaded files are processed, you will need to provide your own logic in the `src/services/api.js` and return a json like:

```json
{
  "text": "text",
  "labels": []
}
```

### Props

| Name   | Default | Description                     |
| ------ | ------- | ------------------------------- |
| filter | _none_  | Name of the facet for filtering |

## Implementation details

### Image analyzis

Using Amazon Rekognition API, the app processes the file to retrieve labels (items) and text.

The detected text and labels are then passed to the `refine` method of the custom connector defined in `src/containers/image-search-box`.

### Custom connector

The component relies on the custom connector `ImageSearchBox` created with the [createConnector](<https://community.algolia.com/react-instantsearch/guide/Custom_connectors.html#const-connector-%3D-createconnector(implementation)>) function.

#### getProvidedProps

`ImageSearchBox` provides two props to the connected component

| Name           | Description                      |
| -------------- | -------------------------------- |
| detectedText   | The text detected from the image |
| detectedLabels | The text items from the image    |

It also provides the function refine to trigger a new query to Algolia:

```js
function refine(text, tags) {}
```

#### refine

The refine function updates the `query` property in the `searchState` to keep the search box in sync. It also saves the detected items under the property `imageSearch`.

#### getSearchParameters

The prop `text` will be passed as the `query` using `.setQuery` and `tags` will be passed as a query parameter `facetFilters` using `.setQueryParameter`.

## Contributing

Contributions are more than welcome <3 Just submit a pull request.
