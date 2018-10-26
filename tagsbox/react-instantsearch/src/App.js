import React, { Component, Fragment } from 'react';
import { InstantSearch, Index } from 'react-instantsearch-dom';

import Tags from './lib/Tags';

import './app.css';

export const TagSelectedComponent = ({ hit }) => (
    <Fragment>
        <code>{hit.iata_code}</code>
    </Fragment>
);

export const TagSuggestionComponent = ({ hit }) => (
    <Fragment>
        {hit.name} <small><code>{hit.iata_code}</code></small><br />
        <small>{hit.city}, {hit.country}</small>
    </Fragment>
);

export const CreateTagComponent = ({ query }) => (
    <Fragment>
        <strong>"{query}"</strong> airport does not exist. Create it?
    </Fragment>
);

class App extends Component {
    onTagsUpdate = (actualTags, previousTags) => {
        console.log('Tags updated', actualTags);
    };

  render() {
    return (
      <div id="app">
          <InstantSearch
              appId="6UF5OXUKTD"
              apiKey="0c5c48f199ef2a73d0e97e6427449d03"
              indexName="airports">
              <Index indexName="airports">
                  <Tags
                      tagSelectedComponent={TagSelectedComponent}
                      tagSuggestionComponent={TagSuggestionComponent}
                      createTagComponent={CreateTagComponent}
                      createTagAttribute="iata_code"
                      onUpdate={this.onTagsUpdate}
                      translations={{ placeholder: "City, Airport IATA…", noResult: "No airport found." }}
                      limitTo={2}
                  />
              </Index>
          </InstantSearch>
      </div>
    );
  }
}

export default App;
