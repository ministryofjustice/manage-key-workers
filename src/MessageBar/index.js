import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class MessageBar extends Component {
  clearMessage (props) {
    setTimeout(function () {
      props.clearMessage();
    }, 2500);
  }

  renderMessage (message) {
    let renderContent = null;
    if (message && message !== '') {
      renderContent = (<div className="messageBarContainer pure-g"><div className="messageBar">
        {this.props.message}
      </div></div>);
      this.clearMessage(this.props);
      return renderContent;
    } else {
      return null;
    }
  }

  render () {
    return this.renderMessage(this.props.message);
  }
}

MessageBar.propTypes = {
  message: PropTypes.string
};

export default MessageBar;
