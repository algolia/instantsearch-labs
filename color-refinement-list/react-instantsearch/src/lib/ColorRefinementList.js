import React, { Component } from "react";
import { connectRefinementList } from "react-instantsearch-dom";

import './ColorRefinementList.css';

class ColorRefinementList extends Component {
    render() {
        return (
            <div className="ais-ColorRefinementList">
                <ul className="ais-ColorRefinementList-container">
                    {this.props.searchable ? (
                        <li>
                            <input
                                type="search"
                                onChange={event =>
                                    this.props.searchForItems(event.currentTarget.value)
                                }
                            />
                        </li>
                    ) : null}
                    {this.props.items.map(item => {
                        const color =
                            item.label.split(";")[1].length === 4
                                ? item.label.split(";")[1] +
                                item.label.split(";")[1].slice(1, 4)
                                : item.label.split(";")[1];

                        return (
                            <a
                                href={this.props.createURL(item.value)}
                                onClick={event => {
                                    event.preventDefault();
                                    this.props.refine(item.value);
                                }}
                                key={item.label}
                            >
                                <li
                                    status={item.isRefined ? "checked" : ""}
                                    className="ais-ColorRefinementElement"
                                    style={{
                                        background: `linear-gradient(145deg, ${color} 53%, ${color}e6 47%)`
                                    }}
                                />
                            </a>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default connectRefinementList(ColorRefinementList);