import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

class MessageBar extends Component {
  clearMessage = props => {
    setTimeout(() => {
      props.clearMessage()
    }, props.displayTime || 5000)
  }

  renderMessage = message => {
    let renderContent = null
    if (message && message !== '') {
      renderContent = (
        <div id="messageBar" className="messageBarContainer pure-g">
          <div className="messageBar">{message}</div>
        </div>
      )
      this.clearMessage(this.props)
      return renderContent
    }

    return null
  }

  render() {
    const { message } = this.props
    return this.renderMessage(message)
  }
}

MessageBar.propTypes = {
  message: PropTypes.string,
}

export default MessageBar
