import React, { Fragment } from 'react'
import { SearchBox } from 'react-instantsearch-dom'
import DebugZone from './debug-zone'
import DropZone from './drop-zone'
import './image-search-box.css'

const PSearchBox = ({
  onUpload,
  loading,
  imageBase64,
  detectedLabels,
  detectedText,
  currentRefinement,
  editing,
  onEditClick,
}) => (
  <Fragment>
    <DropZone onDrop={onUpload} loading={loading} />

    <div className="ps-searchbox">
      {editing ? (
        <SearchBox className="ps-searchbox__input" />
      ) : (
        currentRefinement && (
          <div className="ps-searchbox__edit">
            <span className="ps-searchbox__edit-title">
              Your search for {currentRefinement}
            </span>
            <br />
            <a className="ps-searchbox__edit-link" onClick={onEditClick}>
              Edit
            </a>
          </div>
        )
      )}
    </div>

    {Boolean(imageBase64) && (
      <DebugZone
        imageBase64={imageBase64}
        detectedLabels={detectedLabels}
        detectedText={detectedText}
      />
    )}
  </Fragment>
)

export default PSearchBox
