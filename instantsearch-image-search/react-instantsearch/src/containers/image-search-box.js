import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createConnector } from 'react-instantsearch-dom';
import Api from '../services/api';
import ImageSearchBox from '../components/image-search-box';

const connectImageSearchBox = createConnector({
  displayName: 'ImageSearchBox',

  propTypes: {
    filter: PropTypes.string,
  },

  getProvidedProps(props, searchState) {
    const [detectedText, detectedLabels] = searchState.imageSearch || [
      null,
      [],
    ];

    return {
      detectedText,
      detectedLabels,
    };
  },

  refine(props, searchState, detectedText = null, detectedLabels = []) {
    return {
      ...searchState,
      query: detectedText,
      imageSearch: [detectedText, detectedLabels],
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const [detectedText, detectedLabels] = searchState.imageSearch || [
      null,
      [],
    ];

    return searchParameters
      .setQuery(detectedText)
      .setQueryParameter('facetFilters', [
        detectedLabels.map(label => [props.filter, label].join(':')),
      ]);
  },
});

class ImageSearchBoxContainer extends Component {
  state = { error: null, loading: false, editing: false };

  handleImageUploaded = async imageBase64 => {
    const file = imageBase64.replace(/data:image\/(.+);base64,/, '');

    this.setState({
      error: null,
      imageBase64: null,
      detectedLabels: null,
      detectedText: null,
    });

    this.props.refine();

    try {
      this.setState({ loading: true, editing: false });

      const data = await Api.amazon.processFile(file);

      this.props.refine(data.text, data.tags);

      this.setState({
        imageBase64,
        detectedLabels: data.details.responses['rekognition.detectLabels'],
        detectedText: data.details.responses['rekognition.detectText'],
      });
    } catch (error) {
      this.setState({ error: error.message });
    }

    this.setState({ loading: false });
  };

  handleEditClick = () => this.setState({ editing: true });

  render() {
    return (
      <ImageSearchBox
        {...this.props}
        onUpload={this.handleImageUploaded}
        onEditClick={this.handleEditClick}
        loading={this.state.loading}
        error={this.state.error}
        editing={this.state.editing}
        // Refinement data provided by the connector
        currentRefinement={this.props.detectedText}
        currentLabels={this.props.detectedLabels}
        // For debug purpose
        detectedText={this.state.detectedText}
        detectedLabels={this.state.detectedLabels}
        imageBase64={this.state.imageBase64}
      />
    );
  }
}

export default connectImageSearchBox(ImageSearchBoxContainer);
