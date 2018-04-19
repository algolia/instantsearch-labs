import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownMenuItem from './DropdownMenuItem'
/** 
 * A horizontal Dropdown Menu of facet values. 
 * 
 * Widget will be used as an infinite-scroll menu of facet values.
 * 
 * @name DropdownMenu
 * @kind widget
 * @requires an array of attributes for faceting.
 * must also be configured in Algolia dashboard.
 * 
 * 
 * Great for mobile-responsive web applications.
 * 
 * Will be the widget that devs interact with
*/
class DropdownMenu extends Component {
  render() {
    const { attributes } = this.props

    return(
      <div className="dropdown-facet-container">
        { attributes.map((item, index) => <DropdownMenuItem key={index} attribute={item} {...this.props} />)}
      </div>
    )
  }
}
const defaultProps = {
  hoverable: true
}
DropdownMenu.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  hoverable: PropTypes.bool,
  limit: PropTypes.number,
  searchable: PropTypes.bool
}
DropdownMenu.defaultProps = defaultProps
export default DropdownMenu