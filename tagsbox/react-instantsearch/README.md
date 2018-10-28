# TagsBox Widget

🎥  **[See it Live on CodeSandbox](https://codesandbox.io/s/zv6r2009l)**

## Demo

![Demo of TagsBox Widget](https://cl.ly/6ea705021fda/Screen%252520Recording%2525202018-10-26%252520at%25252001.35%252520PM.gif)

## Description

This is the `TagsBox` Labs widget for [React InstantSearch](https://community.algolia.com/react-instantsearch/). You can use this widget to search and select tags with Algolia and use them later on for any purpose want.

This widget displays an input that will offer tag suggestions while user is typing. Tags can be then clicked to be added to the input.

This helps user to select records for another purpose than searching through them but to reuse them to complete another action later (like choosing a contact for sending an email or a category while creating a blog post for instance).

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

You can copy and paste the JavaScript code from the repository itself, grab it in the [src/lib](src/lib) folder and use the `<Tag />` component.

### CSS

You can copy and paste the necessary CSS code from the repository itself, grab it in [src/lib/Tags.css](src/lib/Tags.css).

## Usage

The simplest usage is:

```jsx
import { InstantSearch } from 'react-instantsearch-dom';
import TagsBox from 'instansearch-tagsbox-react';

export const SelectedTagComponent = ({ hit }) => (
    <Fragment>
        {hit.lastname}
    </Fragment>
);

export const SuggestedTagComponent = ({ hit }) => (
    <Fragment>
        {hit.firstname} {hit.lastname}
    </Fragment>
);

<InstantSearch
    appId="..."
    apiKey="..."
    indexName="..."
>
    <TagsBox
        selectedTagComponent={SelectedTagComponent}
        suggestedTagComponent={SuggestedTagComponent}
        onUpdate={(newTags, previousTags) => console.log(newTags, previousTags)}
        translations={{ placeholder: "Search…", noResult: "…" }}
    />
</InstantSearch>
```

### Requirements

You should encapsulate the `<TagsBox />` component inside an `<InstantSearch />` one.

To work properly, **you'll need to provide three props to the component**:

- `selectedTagComponent` (component): describe how a selected tag should be displayed
  - receive a `hit` as parameter (coming from Algolia)
- `suggestedTagComponent` (component): describe how a suggested tag should be displayed
  - receive a `hit` as parameter (coming from Algolia)
- `onUpdate` (function): called each time a tag is added or removed
  - receive two parameters that represents the new tags and the previous tags. They are both arrays that respectively contains the current selected tags and the previous ones

It is possible to encapsulate the `<TagBox />` component in an `<Index />` one if you wish to target different indices from the same InstantSearch instance.

## Examples

* using the `connectAutoComplete()` connector: [CodeSandbox](https://codesandbox.io/s/zv6r2009l)

### Props

| Name                              | Type      | Use                                                 |
| --------------------------------- | --------- | --------------------------------------------------- |
| selectedTagComponent (required)   | Component | Describe how a selected tag should be displayed.    |
| suggestedTagComponent (required)  | Component | Describe how a suggested tag should be displayed.   |
| onUpdate (required)               | Function  | Called each time a tag is added or removed.           |
| NoResultComponent                 | Component | Describe how an no existing tag should be displayed (should be use with `onAddTag` prop). |
| onAddTag                          | Function  | Called before a tag is added to manipulate the object. It takes either a `hit` (object) or a `value` (string) as parameter and should always return an `object` with a `objectID` value. |
| translations                      | Object    | Set the `placeholder` and `noResult` translations.  |
| limitTo                           | Number    | Restrict the number of tags to select.              |

## Implementation details

This widget is implemented using the [`connectAutoComplete()` connector](https://community.algolia.com/react-instantsearch/connectors/connectAutoComplete.html). To learn more about connectors, you can read the associated [guide](https://community.algolia.com/react-instantsearch/guide/Connectors.html).

## Contributing

To contribute to the project, clone this repository then run:

```sh
yarn
yarn start
```
