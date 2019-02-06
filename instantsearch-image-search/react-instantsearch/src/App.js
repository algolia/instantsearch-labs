import React, { Component } from 'react'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch,
  Hits,
  Pagination,
  Highlight,
  Configure,
} from 'react-instantsearch-dom'
import PropTypes from 'prop-types'
import './App.css'
import ImageSearchBox from './containers/image-search-box'
import ImageSearchLabelsListContainer from './containers/image-search-labels-list'

const searchClient = algoliasearch(
  'ZU45JNFF1V',
  '59951999c0481ca1623ba6efdb3ad22f'
)

const INDEX_NAME = 'picture_search_catalog'

class App extends Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">Picture search</a>
          </h1>

          <p className="header-subtitle">
            using{' '}
            <a href="https://github.com/algolia/react-instantsearch">
              React InstantSearch
            </a>
          </p>
        </header>

        <div className="container">
          <div className="search-panel">
            <div className="search-panel__results">
              <ImageSearchBox filter="_tags" />

              <ImageSearchLabelsListContainer />

              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function Hit({ hit }) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        <h1>
          <Highlight attribute="title" hit={hit} />
        </h1>

        <div className="ais-Hits-item__image-wrapper">
          <img src={hit.images[0]['1500x1500']} alt={hit.title} />
        </div>
      </div>

      <p>
        <Highlight attribute="brand" hit={hit} />
        <br />
        <Highlight attribute="topCategoryNames" hit={hit} />

        {hit._tags.length && (
          <span className="ps-tagcontainer">
            {hit._tags.map(tagName => (
              <span key={tagName} className="ps-tag">
                {tagName}{' '}
              </span>
            ))}
          </span>
        )}
      </p>
    </article>
  )
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
}

export default props => (
  <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
    <Configure sumOrFiltersScores getRankingInfo />
    <App {...props} />
  </InstantSearch>
)
