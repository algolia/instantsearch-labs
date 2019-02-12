import React, { Component } from 'react'
import { createConnector } from 'react-instantsearch-dom'
import ImageSearchLabelsList from '../components/image-search-labels-list'

const connectImageSearchLabels = createConnector({
  displayName: 'ImageSearchLabels',

  getProvidedProps(props, searchState) {
    const detectedLabels = (searchState.imageSearch || [null, []])[1]

    return {
      detectedLabels,
    }
  },

  refine(props, searchState, items) {
    return {
      ...searchState,
      imageSearch: [searchState.imageSearch[0], items],
    }
  },
})

class ImageSearchLabelsListContainer extends Component {
  handleToggle = itemName => {
    const index = this.props.detectedLabels.findIndex(
      label => label === itemName
    )

    if (index >= 0) {
      const items = [
        ...this.props.detectedLabels.slice(0, index),
        ...this.props.detectedLabels.slice(index + 1),
      ]

      this.props.refine(items)
    }
  }

  render() {
    return (
      <ImageSearchLabelsList
        labels={this.props.detectedLabels}
        onToggleClick={this.handleToggle}
      />
    )
  }
}

export default connectImageSearchLabels(ImageSearchLabelsListContainer)
