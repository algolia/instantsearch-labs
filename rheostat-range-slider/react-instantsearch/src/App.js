import React, { Component } from "react";
import {
    InstantSearch,
    Panel,
    Hits,
} from "react-instantsearch-dom";

import "./app.css";
import RheostatRangeSlider from "./lib/RheostatRangeSlider";

class App extends Component {
    render() {
        return (
            <InstantSearch
                appId="B1G2GM9NG0"
                apiKey="aadef574be1f9252bb48d4ea09b5cfe5"
                indexName="demo_ecommerce"
            >
                <main className="search-container">
                    <div className="right-panel">
                        <div id="hits">
                            <Hits />
                        </div>
                    </div>
                    <div className="left-panel">
                        <div id="brands">
                            <Panel header="Price">
                                <RheostatRangeSlider
                                    attribute="price"
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