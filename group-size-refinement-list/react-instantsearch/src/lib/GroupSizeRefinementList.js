import React, { Component } from "react";
import { Highlight, connectRefinementList } from "react-instantsearch-dom";

import "./GroupSizeRefinementList.css";

class GroupSizeRefinementList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: !this.props.showMore,
            nbGroups: this.props.nbGroups ? this.props.nbGroups : 1
        };
    }

    render() {
        let inclusionArrays = [];
        const patterns = [...this.props.patterns, /.*/im]
        let nbGroups = patterns.length
        let sizeGroups = patterns.reduce((sizeGroups, regex) => {
            const sizeGroup = this.props.items.reduce((prevHit, hit) => {
                if (regex.test(hit.label) && !inclusionArrays.includes(hit)) {
                    return { count: prevHit.count + hit.count, hits: [...prevHit.hits, hit] }
                }
                return prevHit
            }, { count: 0, hits: [] });
            inclusionArrays.push(...sizeGroup.hits)
            return [...sizeGroups, sizeGroup]
        }, []);

        //Display the group that has the biggest count
        sizeGroups.sort((first, second) => first.count < second.count ? 1 : first.hits.length < second.hits.length ? 1 : -1);

        //Selected sizes not in main group need to be display if widget is folding
        let selectedSizes = []
        if (!this.state.expanded) {
            nbGroups = this.state.nbGroups
            selectedSizes = this.props.items.filter(hit => !sizeGroups[0].hits.includes(hit) && hit.isRefined)
        }

        return (
            <div className="ais-GroupSizeRefinementList">
                {sizeGroups.slice(0, nbGroups).map((sizeList, index) => (
                    sizeList.hits.length > 0 &&
                    <ul className="ais-GroupSizeRefinementList-container" key={index}>
                        {sizeList.hits.map(item => (
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
                                    <span className="ais-GroupSizeRefinementCount">{item.count}</span>
                                </li>
                            </a>
                        ))}
                    </ul>
                ))}
                {selectedSizes.length > 0 &&
                    <ul className="ais-GroupSizeRefinementList-container">
                        {selectedSizes.map(item => (
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
                                    <span className="ais-GroupSizeRefinementCount">{item.count}</span>
                                </li>
                            </a>
                        ))}
                    </ul>
                }
                {this.props.showMore && sizeGroups.length > this.state.nbGroups && <button onClick={() => this.setState({ expanded: !this.state.expanded })} className="ais-GroupSizeRefinementList-showMore">{this.state.expanded ? "Show less" : "Show more"}</button>}
            </div>
        );
    }
}

export default connectRefinementList(GroupSizeRefinementList);