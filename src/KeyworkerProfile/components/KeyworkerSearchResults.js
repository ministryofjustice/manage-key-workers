import React, { Component } from 'react';
import KeyworkerSearch from "./KeyworkerSearch";
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class KeyworkerSearchResults extends Component {
  render () {
    const keyworkers = this.props.keyworkerList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      const keyworkerHref = '/keyworker/' + a.staffId + '/profile';
      return (
        <tr key={a.staffId}>
          <td className="row-gutters">
            <Link id={`key_worker_${a.staffId}_link`} title="Key worker profile link" className="link" to={keyworkerHref} >{formattedName}</Link>
          </td>
          {/*  <td className="row-gutters">{a.currentRole}</td>
          <td className="row-gutters">{a.status}</td> */}
          <td className="row-gutters">{a.numberAllocated}</td>
        </tr>
      );
    });

    let renderContent = null;
    if (this.props.keyworkerList.length > 0) {
      renderContent = (<div>
        <div className="lede padding-top-large padding-bottom">{this.props.keyworkerList.length} Results:</div>
        <div className="pure-u-md-8-12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {/*  <th>Current role</th>
                <th>Status</th> */}
                <th>No. allocated Offenders</th>
              </tr>
            </thead>
            <tbody>{keyworkers}</tbody>
          </table>
        </div>
      </div>
      );
    } else {
      renderContent = (<div className="lede padding-top-large padding-bottom">No Key workers found</div>);
    }


    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12">
            <h1 className="heading-large">Search for a key worker</h1>
            <KeyworkerSearch gotoNext="/keyworker/results" {...this.props} />
          </div>
          {renderContent}
        </div>
      </div>
    );
  }
}

KeyworkerSearchResults.propTypes = {
  keyworkerList: PropTypes.array
};


export default KeyworkerSearchResults;
