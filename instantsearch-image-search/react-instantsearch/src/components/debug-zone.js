import React, { Component, Fragment } from 'react'
import './debug-zone.css'

class DebugZone extends Component {
  state = { hidden: true }

  handleToggleClick = () => {
    this.setState(state => ({ hidden: !state.hidden }))
  }

  render() {
    const { imageBase64, detectedLabels, detectedText } = this.props

    return (
      <div className="ps-debug">
        {this.state.hidden ? (
          <a className="ps-debug__toggle" onClick={this.handleToggleClick}>
            Show debug
          </a>
        ) : (
          <Fragment>
            <a className="ps-debug__toggle" onClick={this.handleToggleClick}>
              Hide debug
            </a>

            <div className="ps-debug__details">
              <div className="ps-debug__image">
                <img src={imageBase64} alt="uploaded file" />
              </div>

              <div className="ps-debug__code">
                <code>
                  {JSON.stringify(
                    { ...detectedLabels, ...detectedText },
                    null,
                    '  '
                  )}
                </code>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}

export default DebugZone
