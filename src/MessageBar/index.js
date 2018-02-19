import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class MessageBar extends Component {
  renderMessage (message) {
    let renderContent = null;
    if (message && message !== '') {
      renderContent = (<div className="messageBarContainer pure-g"><div className="messageBar">
        {this.props.message}
      </div></div>);
      return renderContent;
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
