import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error extends Component {
  render () {
    return (<div className="error-summary">
      <div className="error-message">
        <div> {this.props.error.message || this.props.error} </div>
      </div>
    </div>);
  }
}

Error.propTypes = {
  error: PropTypes.string.isRequired
};

export default Error;
