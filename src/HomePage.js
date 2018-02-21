import React, { Component } from 'react';
import MessageBar from "./MessageBar/index";
import PropTypes from 'prop-types';

class homepage extends Component {
  render () {
    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-u-md-7-12">
          <h1 className="heading-large">Home page placeholder</h1>
        </div>
      </div>
    );
  }
}

homepage.propTypes = {
  message: PropTypes.string
};

export default homepage;
