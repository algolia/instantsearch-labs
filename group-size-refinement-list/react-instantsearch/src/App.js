import React, { Component } from "react";
import {
    InstantSearch,
    Panel,
    SearchBox,
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
                        <SearchBox
                        />
                        <div id="hits">
                            <Hits />
                        </div>
                    </div>
                    <div className="left-panel">
                        <div id="sizes">
                            <Panel header="Sizes">
                                <GroupSizeRefinementList
                                    attribute="size"
                                    patterns={[/^(S|1A)$/im, /^XXXXL$/im, /^(X?(S|L)|L|XXL)$/im]}
                                    showMore={true}
                                    nbGroups={2}
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