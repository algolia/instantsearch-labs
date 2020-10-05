import React, { Component } from "react";
import { Highlight, connectRefinementList } from "react-instantsearch-dom";

import "./GroupSizeRefinementList.css";

class GroupSizeRefinementList extends Component {
    constructor(props) {
        super(props);
        const showMore = this.props.translations && this.props.translations.showMore ?
            this.props.translations.showMore :
            (expanded) => expanded ? 'Show less' : 'Show more';

        this.state = {
            patterns: [...props.patterns, /.*/im],
            showMore,
            sortGroupByNbResults: props.sortGroupByNbResults !== undefined ? props.sortGroupByNbResults : true,
            sortSizesByNbResults: props.sortSizesByNbResults !== undefined ? props.sortSizesByNbResults : true,
            expanded: !props.showMore,
            nbDispGroups: props.nbGroups ? props.nbGroups : 1,
            nbGroups: props.patterns.length + 1
        };
    }

    sortSizeGroupsByCount = (sizeGroups) => {
        sizeGroups.sort(
            (first, second) =>
                first.hits.length / first.count > second.hits.length / second.count ? 1 :
                    first.hits.length / first.count < second.hits.length / second.count ? -1 : second.hits.length - first.hits.length
        );
    }

    sortSizesByPosition = (sizeGroups) => {
        sizeGroups.map(sizeGroup => sizeGroup.hits.sort(
            (first, second) =>
                parseInt(first.label.split(';')[1], 10) === parseInt(second.label.split(';')[1], 10) ?
                    (first.count < second.count ? 1 : -1) : parseInt(first.label.split(';')[1], 10) - parseInt(second.label.split(';')[1], 10)
        ))
    }

    render() {
        const { expanded, showMore } = this.state;
        let { nbGroups } = this.state;

        let inclusionArrays = [];
        let sizeGroups = this.state.patterns.reduce((acc, regex) => {
            const sizeGroup = this.props.items.reduce((prevHit, hit) => {
                if (regex.test(hit.label.split(';')[0]) && !inclusionArrays.includes(hit)) {
                    return { count: prevHit.count + hit.count, hits: [...prevHit.hits, hit] }
                }
                return prevHit
            }, { count: 0, hits: [] });
            if (sizeGroup.count > 0) {
                inclusionArrays.push(...sizeGroup.hits)
                return [...acc, sizeGroup]
            }
            return acc
        }, []);

        if (this.state.sortGroupByNbResults)
            this.sortSizeGroupsByCount(sizeGroups)

        if (!this.state.sortSizesByNbResults)
            this.sortSizesByPosition(sizeGroups)

        //Compute selected sizes that are not in the nbDispGroups first group to still display them when showMore is set to true
        let selectedSizes = []
        if (!expanded) {
            nbGroups = this.state.nbDispGroups
            selectedSizes = this.props.items.filter(
                hit => hit.isRefined &&
                    sizeGroups.reduce((includes, sizeGroup, i) => includes || (sizeGroup.hits.includes(hit) && i >= nbGroups), false)
            )
        }

        return (
            <div className="ais-GroupSizeRefinementList">
                {sizeGroups.slice(0, nbGroups).map((sizeList, index) => (
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
                                key={item.label.split(';')[0]}
                            >
                                <li
                                    className="ais-GroupSizeRefinementElement"
                                >
                                    {this.props.isFromSearch ? (
                                        <Highlight attribute="label" hit={item} />
                                    ) : (
                                            item.label.split(';')[0]
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
                                key={item.label.split(';')[0]}
                            >
                                <li
                                    className="ais-GroupSizeRefinementElement"
                                >
                                    {this.props.isFromSearch ? (
                                        <Highlight attribute="label" hit={item} />
                                    ) : (
                                            item.label.split(';')[0]
                                        )}
                                    <span className="ais-GroupSizeRefinementCount">{item.count}</span>
                                </li>
                            </a>
                        ))}
                    </ul>
                }
                {this.props.showMore && sizeGroups.length > this.state.nbDispGroups &&
                    <span onClick={() => this.setState({ expanded: !expanded })} className="ais-GroupSizeRefinementList-showMore">
                        {showMore(expanded)}
                    </span>}
            </div>
        );
    }
}

export default connectRefinementList(GroupSizeRefinementList);