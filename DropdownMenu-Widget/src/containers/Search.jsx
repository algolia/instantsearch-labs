import React, { Component } from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';
import DropdownMenu from './DropdownMenu';
import './Dropdown.css'
const Item = ({hit}) => {
  return(
    <div className="item">
      <div style={{width: '100%'}}>
        <img className="center" src={hit.image} style={{width: 60, height: 60, margin: '0 auto'}} />
      </div>
      <h5 className="center">{hit.name}</h5>
    </div>
  )
}

export default class Search extends Component {
  render() {
    return(
      <div>
        <InstantSearch
            appId="32K5HZ0ZVH"
            apiKey="f174fbf173119a647ad26ca2e631b462"
            indexName="shop">
          <nav className="navbar" style={{backgroundColor: 'blue'}}>
            <SearchBox />
          </nav>
          <DropdownMenu attributes={["categories", "brand", "brand", "brand", "brand", "brand"]} />
          <div style={{marginTop: 64}} >
            <Hits hitComponent={Item} />
          </div>
          </InstantSearch>
      </div>
    )
  }
}