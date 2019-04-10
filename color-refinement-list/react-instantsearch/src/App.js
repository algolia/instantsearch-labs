import React, { Component } from "react";
import {
    InstantSearch,
    Panel,
    Hits,
} from "react-instantsearch-dom";

import "./app.css";
import ColorRefinementList from "./lib/ColorRefinementList";

class App extends Component {
    render() {
        return (
            <InstantSearch
                appId="E8KS2J9PMC"
                apiKey="9a2480ff719c1092d2ef9ad3c6d36cf1"
                indexName="colors"
            >
                <main className="search-container">
                    <div className="right-panel">
                        <div id="hits">
                            <Hits />
                        </div>
                    </div>
                    <div className="left-panel">
                        <div id="brands">
                            <Panel header="Colors">
                                <ColorRefinementList
                                    attribute="color"
                                    showMore={true}
                                    searchable={true}
                                    translations={{ placeholder: "Search for other..." }}
                                />
                            </Panel>
                        </div>
                    </div>
                </main>
            </InstantSearch>
        );
    }
}

export default App;