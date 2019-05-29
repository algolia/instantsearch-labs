import React, { Component } from "react";
import { connectRefinementList } from "react-instantsearch-dom";

import './ColorRefinementList.css';

class ColorRefinementList extends Component {
    constructor(props) {
        super(props);
        const showMore = this.props.translations && this.props.translations.showMore ?
            this.props.translations.showMore :
            (expanded) => expanded ? 'Show less' : 'Show more';

        this.state = {
            showMore,
            expanded: !props.showMore,
            limit: props.limit || 10,
            sortByColor: props.sortByColor !== undefined ? props.sortByColor : true
        };
    }

    colorDistance = (color1, color2) => {
        var result = 0;
        for (var i = 0; i < color1.rgb.length; i++) {
            result += (color1.rgb[i] - color2.rgb[i]) * (color1.rgb[i] - color2.rgb[i]);
        } return result;
    };

    sortByColors = (hits) => {
        let distances = hits.reduce((acc, hit, i) => {
            for (let j = 0; j < i; j++)
                acc.push([hit, hits[j], this.colorDistance(hit, hits[j])]);
            return acc;
        }, [])

        distances.sort((a, b) => {
            return a[2] - b[2];
        });

        var colorToCluster = hits.reduce((acc, hit) => {
            acc[hit.label] = [hit];
            return acc;
        }, {});

        return distances.reduce((acc, distance) => {
            var color1 = distance[0];
            var color2 = distance[1];
            if (!color1 || !color2) return acc;
            var cluster1 = colorToCluster[color1.label];
            var cluster2 = colorToCluster[color2.label];
            if (!cluster1 || !cluster2 || cluster1 === cluster2) return acc;

            if (color1 !== cluster1[cluster1.length - 1]) cluster1.reverse();
            if (color2 !== cluster2[0]) cluster2.reverse();

            cluster1 = [...cluster1, ...cluster2];
            delete colorToCluster[color1.label];
            delete colorToCluster[color2.label];
            colorToCluster[cluster1[0].label] = cluster1;
            colorToCluster[cluster1[cluster1.length - 1].label] = cluster1;
            return cluster1;
        }, []);
    };

    render() {
        let { items, translations } = this.props;
        const { expanded, limit, sortByColor, showMore } = this.state

        if (!expanded) {
            let filtered = items.filter((hit) => hit.isRefined)
            if (filtered.length > limit)
                items = filtered
            else
                items = items.slice(0, limit)
        }

        items = items.map(item => {
            if (!("hex" in item)) {
                item.hex = item.label.split(";")[1].length === 4 ? item.label.split(";")[1] + item.label.split(";")[1].slice(1, 4) : item.label.split(";")[1];
                var hex = item.hex.substring(1, item.hex.length);
                item.rgb = [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
                item.label = item.label.split(";")[0];
            }
            return item;
        });

        if (items.length > 0 && sortByColor) {
            //sort alpphabetically to have consistent sorting
            items.sort((a, b) => (a.label > b.label) ? 1 : -1)
            items = this.sortByColors(items);
        }

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
                                placeholder={translations && translations.placeholder ? translations.placeholder : "Search for facets..."}
                            />
                        </li>
                    ) : null}
                    {items.map(item =>
                        (
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
                                        background: `linear-gradient(145deg, ${item.hex} 53%, ${item.hex}e6 47%)`
                                    }}
                                />
                            </a>
                        )
                    )}
                </ul>
                {this.props.showMore && this.props.items.length > limit &&
                    <span onClick={() => this.setState({ expanded: !this.state.expanded })}
                        className="ais-ColorRefinementList-showMore">
                        {showMore(this.state.expanded)}
                    </span>
                }
            </div>
        );
    }
}

export default connectRefinementList(ColorRefinementList);