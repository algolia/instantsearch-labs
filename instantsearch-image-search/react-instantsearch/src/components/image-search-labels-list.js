import React from 'react'
import './image-search-labels-list.css'

const ImageSearchLabelsList = ({ labels, onToggleClick }) => {
  if (labels.length) {
    return (
      <ul className="ps-labels">
        {labels.map((item, index) => (
          <li className="ps-labels__label" key={`${item}-${index}`}>
            {item} <a onClick={() => onToggleClick(item)}>✕</a>
          </li>
        ))}
      </ul>
    )
  }

  return null
}

export default ImageSearchLabelsList
