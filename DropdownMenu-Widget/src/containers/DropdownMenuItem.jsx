import React, { Component } from 'react';
import { connectRefinementList } from 'react-instantsearch/connectors';
/**
 * 
 * Dropdown menu item for DropdownMenu. 
 * 
 * Each component manages its own state and uses the RefinementList connector.
 * 
 * Not typically interacted with directly by devs.
 * 
 * Renders click event if hoverable=false or if on mobile
 * 
 */
const cx = label => `ais-DropdownMenu-${label}`

class DropdownMenuItem extends Component {
  constructor(props){
    super(props)

    this.state = {
      active: false,
      mobile: false,
      activeValues: 0
    }
  }

  componentWillMount() {
    this.setState({width: window.innerWidth, mobile: /Mobi/.test(navigator.userAgent)})
  }
  capitalizeFirst(s){
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  renderItem = (item, i) => (
    <label key={i} className="ais-DropdownMenu-item-label">
      <input
        type="checkbox"
        checked={item.isRefined}
        onChange={() => {this.selectItem(item)}} />
        <span className={cx('item-label-desc')}>
           <span>{item.label}</span><span className={cx('item-count')}> ({item.count})</span>
        </span>
    </label>
      
  )
  selectItem = (item, resetQuery) => {
    this.props.refine(item.value);
    this.setState({activeValues: item.value.length})
  };
  handleClick = e => {
    this.setState({active: !this.state.active})
  }
  render() {
    const { items, attribute, hoverable } = this.props
    const { active, mobile, activeValues } = this.state
    const title = this.capitalizeFirst(attribute)
    
    return(
      (mobile || !hoverable) ?
      <div className="ais-DropdownMenu-container">
        <div className={cx('title-container')} onClick={this.handleClick}>
          <span className="ais-DropdownMenu-title">{title} {
            activeValues ? <p className={cx('active-facets')}>{activeValues}</p>
              : <i className={cx('caret-down')}></i>
          }
          </span>
        </div>
          { active && <div className="ais-DropdownMenu-List">{items.map(this.renderItem)}</div>}
      </div>
      :
      <div className="ais-DropdownMenu-container">
        <div className={cx('title-container')}>
          <span className="ais-DropdownMenu-title">{title} {
            activeValues ? <p className={cx('active-facets')}>{activeValues}</p>
              : <i className={cx('caret-down')}></i>
          }
          </span>
        </div>
          <div className="ais-DropdownMenu-List">{items.map(this.renderItem)}</div>
      </div>
    )
  }
} 

export default connectRefinementList(DropdownMenuItem)