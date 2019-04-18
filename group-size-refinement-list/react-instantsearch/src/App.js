import React, { Component } from "react";
import {
    InstantSearch,
    Panel,
    Hits,
} from "react-instantsearch-dom";

import "./app.css";
import GroupSizeRefinementList from "./lib/GroupSizeRefinementList";

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
                        <div id="sizes">
                            <Panel header="Sizes">
                                <GroupSizeRefinementList
                                    attribute="size"
                                    patterns={[/^((X?(S|L))|M|XXL|XXXL|[2-5]XL)$/im]}
                                    showMore={true}
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