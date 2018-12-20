import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import './drop-zone.css'

export default class ImageDropZone extends Component {
  state = { uploadedFile: null }

  handleDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      const { onDrop } = this.props

      reader.onload = () => onDrop(reader.result)
      reader.readAsDataURL(file)
    }
  }

  componentWillUnmount() {
    URL.revokeObjectURL(this.state.uploadedFile)
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        accept="image/x-png,image/jpeg"
        className="ps-dropzone"
        activeClassName="ps-dropzone--active"
        acceptClassName="ps-dropzone--accepted"
        rejectClassName="ps-dropzone--rejected"
        disabled={this.props.loading}
      >
        {this.props.loading ? 'Loading' : 'Click or drop a file here'}
      </Dropzone>
    )
  }
}
