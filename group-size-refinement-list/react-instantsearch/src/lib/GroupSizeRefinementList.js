import React, { Component } from "react";
import { Highlight, connectRefinementList } from "react-instantsearch-dom";

import "./GroupSizeRefinementList.css";

class GroupSizeRefinementList extends Component {
    render() {
        let sizeGroups = [];
        let inclusionArrays = [];
        if (this.props.patterns) {
            this.props.patterns.forEach((regex, i) => {
                sizeGroups[i] = this.props.items.filter(
                    hit => regex.test(hit.label) && !inclusionArrays.includes(hit)
                );
                inclusionArrays.push(...sizeGroups[i]);
            });
        }

        const nonMatchGroup = this.props.items.filter(
            hit => !inclusionArrays.includes(hit)
        );
        if (nonMatchGroup.length) sizeGroups[sizeGroups.length] = nonMatchGroup;
        return (
            <div className="ais-GroupSizeRefinementList">
                {sizeGroups.map((sizeList, index) => (
                    <ul className="ais-GroupSizeRefinementList-container" key={index}>
                        {sizeList.map(item => (
                            <a
                                status={item.isRefined ? "checked" : ""}
                                href={this.props.createURL(item.value)}
                                style={{ fontWeight: item.isRefined ? "bold" : "" }}
                                onClick={event => {
                                    event.preventDefault();
                                    this.props.refine(item.value);
                                }}
                                key={item.label}
                            >
                                <li
                                    className="ais-GroupSizeRefinementElement"
                                >
                                    {this.props.isFromSearch ? (
                                        <Highlight attribute="label" hit={item} />
                                    ) : (
                                            item.label
                                        )}
                                    <li className="ais-GroupSizeRefinementCount">{item.count}</li>
                                </li>
                            </a>
                        ))}
                    </ul>
                ))}
            </div>
        );
    }
}

export default connectRefinementList(GroupSizeRefinementList);