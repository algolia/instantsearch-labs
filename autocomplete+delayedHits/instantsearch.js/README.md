# Example

## Description

### What
An experimental UX which combines autocomplete and instant search, but delays the the instant search results by a few hundred milliseconds of your choosing

### Why
Requested by a client because delaying the instant search results limits visual noise and allows users to better understand what is going on

### How
A custom instant search widget that integrates autocomplete.js with a query suggestions index as the source.

* [See it live on Codesandobox](https://codesandbox.io/s/x7v977n2mz)
* [See it live on the demo-server](https://internal-preview.algolia.com/delayed-hits-demo)

## Running the experimentation locally

```
yarn
yarn start
```

## Tutorial

### Step 1
* Copy the custom render function from [autocomplete-widget.js](/src/autocomplete-widget.js)
* Set delay time in ms / nb suggestions as you see fit

### Step2
* Add the custom widget to the instant search instance

### Step 3
* Profit! 💵💵💵

## Known limitations
None
