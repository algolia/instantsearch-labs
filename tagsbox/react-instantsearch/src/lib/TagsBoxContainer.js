import React from 'react';
import PropTypes from 'prop-types';

class TagsBoxContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
            inputDisabled: false,
        };

        this.inputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { inputValue } = this.state;
        const { refine, tags, hits, onUpdateHoveredTag, limitedTo } = this.props;

        if (inputValue !== prevState.inputValue) {
            refine(inputValue);
        }

        if (hits.length !== prevProps.hits.length && hits.length === 1) {
            onUpdateHoveredTag(1);
        }

        if (tags.length !== prevProps.tags.length) {
            this.setState({
                inputValue: '',
                inputDisabled: typeof limitedTo !== 'undefined' && tags.length === limitedTo
            }, this.inputRef.current.focus());
        }
    }

    onInputValueChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    catchSpecialKeys = e => {
        const { inputValue } = this.state;
        const { hits, tags, hoveredTagIndex, onAddTag, onRemoveTag, onUpdateHoveredTag, noResultComponent } = this.props;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            onUpdateHoveredTag(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onUpdateHoveredTag(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();

            if (hits.length && hoveredTagIndex !== -1) {
                onAddTag(hits[hoveredTagIndex]);
            }

            if (!hits.length && typeof noResultComponent !== 'undefined') {
                onAddTag(inputValue);
            }

        } else if (e.key === 'Backspace' && inputValue.trim() === '' && tags.length > 0) {
            onRemoveTag(tags[tags.length - 1].objectID);
        }
    };

    render() {
        const { inputValue, inputDisabled } = this.state;
        const { tags, currentRefinement, onRemoveTag, selectedTagComponent: SelectedTagComponent, translations } = this.props;

        return (
            <div
                onClick={() => this.inputRef.current.focus()}
                className={`ais-TagsBox ${currentRefinement !== '' ? 'opened' : ''}`}
            >
                <ul className="ais-TagsBox-tags">
                    {tags.map(tag =>
                        <li key={tag.objectID} className="ais-TagsBox-tag" onClick={() => onRemoveTag(tag.objectID)}>
                            <SelectedTagComponent hit={tag} />
                            <span className="ais-TagsBox-removeTag">✕</span>
                        </li>
                    )}

                    <li className="ais-TagsBox-inputTag">
                        <input type="text"
                               ref={this.inputRef}
                               value={inputValue}
                               disabled={inputDisabled}
                               onKeyDown={this.catchSpecialKeys}
                               onChange={this.onInputValueChange}
                               autoCapitalize="off" autoComplete="off" autoCorrect="off"
                               placeholder={translations && (translations.placeholder ? translations.placeholder : '')} spellCheck="false" />
                    </li>
                </ul>
            </div>
        )
    }
}

TagsBoxContainer.propTypes = {
    tags: PropTypes.array.isRequired,
    onRemoveTag: PropTypes.func.isRequired,
    selectedTagComponent: PropTypes.func.isRequired
};

export default TagsBoxContainer;