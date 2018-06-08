import React, { Component } from 'react';
import KeyworkerSearch from "./KeyworkerSearch";
import PropTypes from 'prop-types';

class KeyworkerSearchPage extends Component {
  render () {
    return (
      <div>
        {this.props.displayBack()}
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large">Search for a key worker</h1>
            <KeyworkerSearch {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearchPage.propTypes = {
  displayBack: PropTypes.func.isRequired
};

export default KeyworkerSearchPage;
