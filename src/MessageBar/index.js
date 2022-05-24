import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

class MessageBar extends Component {
  clearMessage = (props) => {
    setTimeout(() => {
      props.clearMessage()
    }, props.displayTime || 5000)
  }

  renderMessage = (message) => {
    let renderContent = null
    if (message && message !== '') {
      renderContent = (
        <div
          className="govuk-notification-banner govuk-notification-banner--success"
          role="alert"
          aria-labelledby="govuk-notification-banner-title"
          data-module="govuk-notification-banner"
        >
          <div className="govuk-notification-banner__header">
            <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
              Success
            </h2>
          </div>
          <div className="govuk-notification-banner__content">
            <h3 className="govuk-notification-banner__heading">{message}</h3>
          </div>
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

MessageBar.defaultProps = {
  message: '',
}

export default MessageBar
