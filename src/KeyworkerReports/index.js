import React, { Component } from 'react';
import { Link } from "react-router-dom";

class KeyworkerProfile extends Component {
  render () {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-7-12">
            <h1 className="heading-large">Key worker reports placeholder</h1>
            <div className="pure-u-md-6-12">
              <Link className="link" to="/home" >Return to key worker management</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default KeyworkerProfile;
