import React, { Fragment } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import PropTypes from "prop-types";

import TagsBoxContainer from './TagsBoxContainer';
import SuggestedTagsContainer from './SuggestedTagsContainer';

import './Tags.css';

class Tags extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [ ],
            hoveredTagIndex: -1
        }
    }

    componentDidUpdate(prevProps) {
        const { currentRefinement } = this.props;

        if (currentRefinement !== prevProps.currentRefinement) {
            this.setState({
                hoveredTagIndex: -1,
            });
        }
    }

    addTag = hit => {
        const { tags } = this.state;
        const { onUpdate } = this.props;

        this.setState({ tags: [ ...tags,  hit ]}, () => {
            onUpdate(this.state.tags, tags);
        });
    };

    removeTag = hitObjectID => {
        const { tags } = this.state;
        const { onUpdate } = this.props;

        const updatedTags = [ ...tags ];
        const indexToRemove = updatedTags.findIndex(tag => tag.objectID === hitObjectID);
        updatedTags.splice(indexToRemove, 1);

        this.setState({ tags: updatedTags }, () => {
            onUpdate(this.state.tags, tags);
        })
    };

    updateHoveredTagIndex = operation => {
        const { hits } = this.props;
        const { hoveredTagIndex } = this.state;

        if (operation > 0 && hoveredTagIndex < hits.length - 1) {
            this.setState({ hoveredTagIndex: hoveredTagIndex + operation });
        } else if (operation < 0 && hoveredTagIndex > 0) {
            this.setState({ hoveredTagIndex: hoveredTagIndex + operation });
        }
    };

    render() {
        const { tags, hoveredTagIndex } = this.state;

        return (
            <Fragment>
                <TagsBoxContainer
                    tags={tags}
                    hoveredTagIndex={hoveredTagIndex}
                    onAddTag={this.addTag}
                    onRemoveTag={this.removeTag}
                    onUpdateHoveredTag={this.updateHoveredTagIndex}
                    {...this.props} />

                <SuggestedTagsContainer
                    tags={tags}
                    hoveredTagIndex={hoveredTagIndex}
                    onAddTag={this.addTag}
                    {...this.props } />
            </Fragment>
        )
    }
}

Tags.propTypes = {
    selectedTagComponent: PropTypes.func.isRequired,
    suggestedTagComponent: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    translations: PropTypes.object,
    limitTo: PropTypes.number
};

export default connectAutoComplete(Tags);