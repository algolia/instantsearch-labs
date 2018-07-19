import React, { Component } from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';
import DropdownRefinementList from './component/DropdownRefinementList';
import './component/DropdownRefinementList.css';
const Item = ({ hit }) => {
  return (
    <div className="item">
      <div style={{ width: '100%' }}>
        <img
          alt="product"
          className="center"
          src={hit.image}
          style={{ width: 60, height: 60, margin: '0 auto' }}
        />
      </div>
      <h5 className="center">{hit.name}</h5>
    </div>
  );
};

export default class App extends Component {
  render() {
    return (
      <div>
        <InstantSearch
          appId="latency"
          apiKey="6be0576ff61c053d5f9a3225e2a90f76"
          indexName="instant_search"
        >
          <nav className="navbar" style={{ backgroundColor: 'blue' }}>
            <SearchBox />
          </nav>
          <div style={{ display: 'flex', justifyItems: 'flex-start' }}>
            <DropdownRefinementList hoverable attribute={'categories'} />
            <DropdownRefinementList
              defaultRefinement={['Apple']}
              attribute={'brand'}
            />
          </div>
          <div style={{ marginTop: 64 }}>
            <Hits hitComponent={Item} />
          </div>
        </InstantSearch>
      </div>
    );
  }
}
