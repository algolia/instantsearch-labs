import React, { Component } from "react";
import {
    InstantSearch,
    Pagination,
    Hits,
    Configure,
    Highlight,
    Snippet
} from "react-instantsearch-dom";
import "./app.css";
import PredictiveSearchBox from "./lib/PredictiveSearchBox";

class App extends Component {
    render() {
        return (
            <InstantSearch
                appId="932LAAGOT3"
                apiKey="6a187532e8e703464da52c20555c37cf"
                indexName="atis-prods"
            >
                <main className="search-container">
                    <Configure
                        hitsPerPage={5}
                        attributesToSnippet={["description:24"]}
                        snippetEllipsisText=" [...]"
                    />
                    <div className="right-panel">
                        <div id="hits">
                            <Hits
                                hitComponent={({ hit }) => {
                                    return (
                                        <div className="hit">
                                            <div className="hit-image">
                                                <img src={hit.largeImage} alt={hit.title} />
                                            </div>
                                            <div className="hit-content">
                                                <div>
                                                    <div className="hit-name">
                                                        <Highlight
                                                            attribute="title"
                                                            hit={hit}
                                                            tagName="em"
                                                        />
                                                    </div>
                                                    <div className="hit-description">
                                                        <Snippet attribute="type" hit={hit} />
                                                    </div>
                                                </div>
                                                <div className="hit-price">${hit.price}</div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        <div id="searchbox">
                            <PredictiveSearchBox
                                translations={{ placeholder: "Search for anything" }}
                                suggestionsIndex="atis-prods_query_suggestions"
                                appID="932LAAGOT3"
                                apiKey="6a187532e8e703464da52c20555c37cf"
                                placeholder="Search for products and brands"
                                maxSuggestions={30}
                            />
                        </div>
                        <div id="pagination">
                            <Pagination />
                        </div>
                    </div>
                    <div className="left-panel" />
                </main>
            </InstantSearch>
        );
    }
}

export default App;
