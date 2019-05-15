import React, { Component } from 'react';

import { connectRange } from "react-instantsearch-dom";
import PropTypes from "prop-types";
import Rheostat from "rheostat";

import './RheostatRangeSlider.css';


class RheostatRangeSlider extends Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        currentRefinement: PropTypes.object,
        refine: PropTypes.func.isRequired,
        canRefine: PropTypes.bool.isRequired
    };

    state = { currentValues: { min: this.props.min, max: this.props.max } };

    componentWillReceiveProps = sliderState => {
        if (sliderState.canRefine) {
            const { min, max } = sliderState.currentRefinement
            this.setState({
                currentValues: {
                    min: min,
                    max: max
                }
            });
        }
    }

    onValuesUpdated = sliderState => {
        const { min, max } = this.props;
        this.setState({
            currentValues: {
                min: Math.min(Math.max(sliderState.values[0], min), max),
                max: Math.max(Math.min(sliderState.values[1], max), min)
            }
        });
    };

    onChange = sliderState => {
        const { min, max } = this.props;
        if (
            this.props.currentRefinement.min !== sliderState.values[0] ||
            this.props.currentRefinement.max !== sliderState.values[1]
        ) {
            let computedMin = Math.min(Math.max(sliderState.values[0], min), max)
            let computedMax = Math.max(Math.min(sliderState.values[1], max), min)
            if (computedMin === computedMax && computedMin > min)
                computedMin -= 1
            else if (computedMin === computedMax && computedMax < max)
                computedMax += 1

            this.props.refine({
                min: computedMin,
                max: computedMax
            });
        }
    };

    render = () => {
        const { min, max, currentRefinement } = this.props;
        const { currentValues } = this.state;
        return min !== max ? (
            <div className="ais-RheostatRangeSlider-wrapper">
                <div className="ais-RheostatRangeSlider-value">{currentValues.min}</div>
                <Rheostat
                    className="ais-RheostatRangeSlider"
                    min={min}
                    max={max}
                    snap={true}
                    values={[currentRefinement.min, currentRefinement.max]}
                    onChange={this.onChange}
                    onValuesUpdated={this.onValuesUpdated}
                />
                <div className="ais-RheostatRangeSlider-value">{currentValues.max}</div>
            </div>
        ) : (
                <div className="ais-RheostatRangeSlider-item">No range to display.</div>
            );
    }
}

export default connectRange(RheostatRangeSlider)