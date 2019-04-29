import React, { Component } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch";

import "./PredictiveSearchBox.css";

class PredictiveSearchBox extends Component {
    constructor(props) {
        super(props);
        const client = algoliasearch(this.props.appID, this.props.apiKey);
        const suggestionIndex = client.initIndex(this.props.suggestionsIndex);
        this.state = {
            suggestionIndex,
            currentSuggestion: "",
            suggestionTags: []
        };
        this.computeUpdatedState = this.computeUpdatedState.bind(this);
        this.refineSuggestionsAndSearch = this.refineSuggestionsAndSearch.bind(
            this
        );
    }

    refineSuggestionsAndSearch(value) {
        this.computeUpdatedState(value).then(event => {
            this.setState(
                { ...event.newState },
                this.props.refine(value)
            );
        });
    }

    computeUpdatedState(searchBoxValue) {
        let newState = {
            currentSuggestion: "",
            suggestionTags: []
        };
        const oldState = this.state;
        const oldProps = this.props;
        if (searchBoxValue === "") {
            return new Promise(function (resolve, reject) {
                resolve({ value: "", newState });
            });
        } else {
            return new Promise(function (resolve, reject) {
                oldState.suggestionIndex.search(
                    { query: searchBoxValue },
                    (err, res) => {
                        if (res && res.hits.length > 0) {
                            if (res.hits[0].query.startsWith(searchBoxValue.toLowerCase())) {
                                newState.currentSuggestion =
                                    searchBoxValue +
                                    res.hits[0].query.substring(searchBoxValue.length);
                            } else {
                                newState.currentSuggestion = "";
                            }
                        } else {
                            newState.currentSuggestion = "";
                        }

                        // Update suggestionTags
                        if (oldProps.maxSuggestions || oldProps.maxSuggestions === 0) {
                            // Add tags up to maxSuggestions
                            let addedTags = 0;
                            if (
                                res &&
                                (
                                    res.hits.length > 1 ||
                                    (res.hits.length === 1 && res.hits[0].query !== searchBoxValue)
                                )
                            ) {
                                res.hits.forEach(hit => {
                                    if (addedTags === oldProps.maxSuggestions) {
                                        return;
                                    }
                                    if (searchBoxValue.toLowerCase() !== hit.query.toLowerCase())
                                        newState.suggestionTags.push(hit);
                                    addedTags++;
                                });
                            }
                        }
                        resolve({ value: searchBoxValue, newState });
                    }
                );
            });
        }
    }

    componentDidUpdate() {
        this.refs.SuggestionTagsContainer.scrollLeft = 0;
    }

    render() {
        return (
            <div className="ais-PredictiveSearchBox"
                onMouseEnter={() => this.setState({ hover: true })}
                onMouseLeave={() => this.setState({ hover: false })}
            >
                <div className="ais-PredictiveBox"
                    style={{
                        display: (this.state.suggestionTags.length >= 1 && (this.state.focus || this.state.hover))
                            ? "flex" : "none"
                    }}>
                    <span id="predictive-item">{this.state.currentSuggestion}</span>
                </div>
                <input
                    type="search"
                    placeholder={this.props.translations.placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required=""
                    maxLength="512"
                    className="ais-PredictiveSearchBox-input"
                    value={this.props.currentRefinement}
                    onChange={event =>
                        this.refineSuggestionsAndSearch(event.target.value)
                    }
                    onBlur={() => this.setState({ focus: false })}
                    onFocus={() => this.setState({ focus: true })}
                    onKeyDown={event => {
                        if (event.keyCode === 9 && this.state.currentSuggestion !== "") {
                            event.preventDefault();
                            this.refineSuggestionsAndSearch(this.state.currentSuggestion);
                        }
                    }}
                />
                <button
                    type="reset"
                    title="Clear the search query."
                    className="ais-PredictiveSearchBox-reset"
                    hidden=""
                    style={{
                        display: this.props.currentRefinement === "" ? "none" : "block"
                    }}
                    onClick={() => this.refineSuggestionsAndSearch("")}
                >
                    <svg
                        className="ais-PredictiveSearchBox-resetIcon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        width="10"
                        height="10"
                    >
                        <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z" />
                    </svg>
                </button>
                <ul
                    ref="SuggestionTagsContainer"
                    className="ais-SuggestionTagsContainer"
                    style={{
                        display: (this.state.suggestionTags.length >= 1 && (this.state.focus || this.state.hover)) ? "flex" : "none",
                        overflowX:
                            this.state.suggestionTags.length >= 1 ? "scroll" : "hidden"
                    }}
                >
                    {this.state.suggestionTags.map((hit, index) => {
                        return (
                            <li
                                key={index}
                                className="ais-SuggestionTag"
                                onClick={() => this.refineSuggestionsAndSearch(hit.query)}
                                dangerouslySetInnerHTML={{
                                    __html: hit._highlightResult.query.value
                                }}
                            />
                        );
                    })}
                </ul>
            </div >
        );
    }
}

export default connectSearchBox(PredictiveSearchBox);
