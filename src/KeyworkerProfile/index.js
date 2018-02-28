import React, { Component } from 'react';
import KeyworkerSearch from "../KeyworkerSearch/index";

class KeyworkerSearchPage extends Component {
  render () {
    return (
      <div>
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

export default KeyworkerSearchPage;
