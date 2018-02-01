# How to Contribute

## Convention 

This repository respect a structure following this particular convention:

* Experimentation name
    * InstantSearch.js
        * src
        * README.md 
        * ...
    * React InstantSearch
    * Vue InstantSearch
    * Angular InstantSearch

**Warning:** You’re not force to add an experimentation for every InstantSearch. If it's a new one, just add the flavor(s) you cover. 

## Getting Started

To help you get started we provide templates that runs in codesandbox and that you can re-use. 

- [InstantSearch.js](https://codesandbox.io/s/github/algolia/instantsearch-templates/tree/master/src/InstantSearch.js)
- [React InstantSearch](https://codesandbox.io/s/github/algolia/instantsearch-templates/tree/master/src/React%20InstantSearch)
- [Angular InstantSearch](https://codesandbox.io/s/github/algolia/instantsearch-templates/tree/master/src/Angular%20InstantSearch) (TODO)
- [Vue InstantSearch](https://codesandbox.io/s/github/algolia/instantsearch-templates/tree/master/src/Vue%20InstantSearch) (TODO)

Source: [InstantSearch Templates](https://github.com/algolia/instantsearch-templates/)

## Readme

Every experimentation should have a README following this structure: 

### Description

Explain here what your experimentation is doing and its purposes. 

If feasible add a codesandbox link that will allow anyone to play directly with it.  

Format of codesandbox link:

`https://codesandbox.io/s/github/algolia/instantsearch-labs/tree/master/experimentation-name/instantsearch-flavor`

### Running the experimentation locally

Add here instruction about how to run locally the experimentation. It should be as simple as:

```
yarn
yarn start
```

### Tutorial

Describe the required steps to reproduce the experimentation on another InstantSearch project. 

If there's any mandatory indices configuration, do not forget to mention them.

### Known limitations  

If the experimentation as edge cases or know limitation, describe them here. 
