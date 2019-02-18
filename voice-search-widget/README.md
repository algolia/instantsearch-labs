# Voice Search Widget

🎥 **[See it live](https://preview.algolia.com/voice-search-demo/).**

## Demo

![Demo](https://d2ddoduugvun08.cloudfront.net/items/2h400I0M2P0D2d3c2D13/voice-search.gif)

## Description

This is a Voice Search Widget. It is using the Chrome API when running on Chrome but it is using the Google Cloud Platform Speech-To-Text API when running on any other browsers.

**Table of Contents**

* [Get the code](#get-the-code)
  * [JavaScript](#javascript)
* [Usage](#usage)
  * [Requirements](#requirements)
* [Known limitations](#known-limitations)
* [Implementation details](#implementation-details)
* [Contributing](#contributing)

## Get the code

This widget comes with JavaScript but also pre-defined CSS.

### JavaScript

You can copy and paste the JavaScript code from the repository itself, grab the full voice-widget folder in public/.

## Usage

The simplest usage is:

```js

var socket = io.connect("http://....:port/");

const search = instantsearch({
  indexName: "...",
  searchClient: algoliasearch("...", "..."),
});

search.addWiget(instantsearch.widgets.hits({ container: '#hits' }));
search.addWidget(
  new VoiceWidget({
    container: "#voice-search",
    placeholder: "Search for ....",
    socket: socket,
    processor: "gcp" // gcp || 
  })
);
```

### Requirements

To use this widget, you need to create an account on GCP to get credentials and then:
* Base64 encode the credentials (the Javascript Object)
* Define a new environement variable called SPEECH_GCP_CREDENTIALS with the value of the base64 encoded
* You're good to go!

## Known limitations

It would not work on old browsers: https://caniuse.com/#search=getUserMedia

## Implementation details

This widget is implemented using a [custom widget](https://www.algolia.com/doc/guides/building-search-ui/widgets/create-your-own-widgets/js/).

## Contributing

To contribute to the project, clone this repository, add your credentials to the congif file (based on the credentials-example) and then run:

```sh
npm install
npm start
```

## Disclaimer

THIS CUSTOM CODE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT ANY WARRANTY OF ANY KIND. ALGOLIA DISCLAIMS ALL OBLIGATION AND LIABILITY UNDER THE APPLICABLE SUBSCRIPTION DOCUMENTS FOR ANY HARM OR DAMAGE ARISING OUT OF OR IN CONNECTION WITH CUSTOM CODE.