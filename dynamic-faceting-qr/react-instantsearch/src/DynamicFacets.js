import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  connectStateResults,
  RefinementList,
  Menu,
  RangeInput,
} from 'react-instantsearch-dom';

const DynamicWidgets = {
  RefinementList,
  Menu,
  RangeInput,
};

class DynamicFacets extends Component {
  static propTypes = {
    limit: PropTypes.number,
    searchState: PropTypes.object,
    searchResults: PropTypes.object,
  };

  static defaultProps = {
    limit: 10,
  };

  render() {
    if (this.props.searchResults && this.props.searchResults.userData) {
      // get the data returned by the query rule
      const uniques = this.props.searchResults.userData
        // only get the dynamic facet type
        .filter(({ type }) => type === 'dynamic_facets')
        // only add one widget per attribute
        .reduce((acc, { facets }) => {
          facets.forEach(({ attribute, widgetName }) =>
            acc.set(attribute, widgetName)
          );
          return acc;
        }, new Map());

      const facets = [...uniques]
        // limit it
        .slice(0, this.props.limit)
        // turn the name of the widget into its value
        .map(([attribute, widgetName]) => ({
          attribute,
          widgetName,
          Widget: DynamicWidgets[widgetName],
        }));

      if (facets.length > 0) {
        return this.props.children({ facets });
      }
    }
    return null;
  }
}

export default connectStateResults(DynamicFacets);
