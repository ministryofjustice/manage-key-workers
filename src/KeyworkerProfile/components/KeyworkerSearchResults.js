import React, { Component } from 'react';
import KeyworkerSearch from "./KeyworkerSearch";
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { getStatusDescription } from "../keyworkerStatus";


class KeyworkerSearchResults extends Component {
  buildTableForRender () {
    if (!(this.props.keyworkerList && this.props.keyworkerList.map)) {
      return [];
    }
    return this.props.keyworkerList.map(a => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      const keyworkerHref = '/keyworker/' + a.staffId + '/profile';
      return (
        <tr key={a.staffId}>
          <td className="row-gutters">
            <Link id={`key_worker_${a.staffId}_link`} title="Key worker profile link" className="link" to={keyworkerHref}>{formattedName}</Link>
          </td>
          <td className="row-gutters">{getStatusDescription(a.status)}</td>
          <td className="row-gutters">{a.numberAllocated}</td>
          <td className="row-gutters">{a.capacity}</td>
          <td className="row-gutters">{a.autoAllocationAllowed ? "yes" : "no"}</td>
        </tr>
      );
    });
  }

  render () {
    const keyworkers = this.buildTableForRender();

    return (
      <div>
        <div className="pure-g padding-bottom-large">
          {this.props.displayBack()}
          <div className="pure-u-md-8-12 ">
            <h1 className="heading-large">Search for a key worker</h1>
            <KeyworkerSearch {...this.props} />
          </div>
          <div>
            <div className="lede padding-top-large padding-bottom-small bold">{keyworkers.length} Results:</div>
            <div className="pure-u-md-9-12">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>No. allocated prisoners</th>
                    <th>Capacity</th>
                    <th>Auto allocation</th>
                  </tr>
                </thead>
                <tbody>{keyworkers}</tbody>
              </table>
              {keyworkers.length === 0 && <div className="font-small padding-top-large padding-bottom padding-left">No Key workers found</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

KeyworkerSearchResults.propTypes = {
  keyworkerList: PropTypes.array,
  displayBack: PropTypes.func.isRequired
};


export default KeyworkerSearchResults;
