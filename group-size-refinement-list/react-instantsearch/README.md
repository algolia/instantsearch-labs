# GroupSizeRefinementList Widget

🎥  **[See it Live on CodeSandbox](https://codesandbox.io/s/94xn0rx90p)**

## Demo

![Demo of GroupSizeRefinementList Widget](https://cl.ly/31605ff28d57/Screen%20Recording%202019-04-11%20at%2003.47%20PM.gif)

## Description

This is the `GroupSizeRefinementList` Labs widget for [React InstantSearch](https://community.algolia.com/react-instantsearch/). You can use this widget to refine products sizes with Algolia.

This widget displays groups of facets depending on passed regex.

This helps the user find the sizes he is looking for, grouping them by format.  

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

You can copy and paste the JavaScript code from the repository itself, grab it in the [src/lib](src/lib) folder and use the `<GroupSizeRefinementList />` component.

### CSS

You can copy and paste the necessary CSS code from the repository itself, grab it in [src/lib/GroupSizeRefinementList.css](src/lib/GroupSizeRefinementList.css).

## Usage

Install it with `yarn add instantsearch-group-size-refinement-list-react` then, use it as simply as:

```jsx
import { InstantSearch, Panel } from 'react-instantsearch-dom';
import GroupSizeRefinementList from 'instantsearch-group-size-refinement-list-react';

<InstantSearch
    appId="..."
    apiKey="..."
    indexName="..."
>
    <Panel header="...">
        <GroupSizeRefinementList
            attribute="..."
            patterns="<array of regex>"
        />
    </Panel>
</InstantSearch>
```

### Requirements

You should encapsulate the `<GroupSizeRefinementList/>` component inside a `<Panel/>` and in an `<InstantSearch/>` one.

To work properly, **you'll need to specify the record attribute**:

### Props

| Name                              | Type           | Use                                                                                                  |
| --------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| attribute (required)              | string         | The name of the attribute                                                                            |
| patterns (required)               | Array(string)  | The regex patterns for each blocks                                                                   |
| nbGroups                          | Number         | The number of group sizes to display by default when showMore is set to true                         |
| sortGroupByNbResults              | Boolean        | Display first results with the most result. If false, it will use the regex order. Default: True     |
| sortSizesByNbResults              | Boolean        | Display first the sizes with the most hits. If false, see formatting bellow[^footnote] Default: True |

[^footnote]: To sort the sizes manualy, you need to pass a number corresponding to the position of the size in the size group.
This number has to follow the size label, you should use a ';' as separator.
Example: XXL;3 - S;1 - M;2 will display S, M and XXL in this order

## Implementation details

This widget is implemented using the [`connectRefinementList()` connector](https://www.algolia.com/doc/api-reference/widgets/refinement-list/react/). To learn more about connectors, you can read the associated [guide](https://community.algolia.com/react-instantsearch/guide/Connectors.html).

## Contributing

To contribute to the project, clone this repository then run:

```sh
yarn
yarn start
```
