import React, { Component } from 'react';
import { properCaseName } from "../../stringUtils";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class KeyworkerProfile extends Component {
  render () {
    const keyworkerDisplayName = properCaseName(this.props.keyworker.firstName) + ' ' + properCaseName(this.props.keyworker.lastName);
    const allocations = this.props.keyworkerAllocations.map(a => {
      let confirmedReleaseDate = a.confirmedReleaseDate;
      if (confirmedReleaseDate == null) {
        confirmedReleaseDate = "--";
      }
      let crsaClassification = a.crsaClassification;
      if (crsaClassification == null) {
        crsaClassification = "--";
      }

      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.bookingId}>
          <td className="row-gutters"><a href="">{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{confirmedReleaseDate}</td>
          <td className="row-gutters">{crsaClassification}</td>
        </tr>
      );
    });

    let renderContent = null;
    if (this.props.keyworkerAllocations.length > 0) {
      renderContent = (<div>
        <div className="lede padding-top-large padding-bottom">Current key worker allocations {this.props.keyworkerAllocations.length}</div>
        <div className="pure-u-md-8-12">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>NOMS ID</th>
                <th>Location</th>
                <th>CRD</th>
                <th>CSRA</th>
              </tr>
            </thead>
            <tbody>{allocations}</tbody>
          </table>
        </div>
      </div>
      );
    } else {
      renderContent = (<div className="lede padding-top-large padding-bottom">No allocations found</div>);
    }


    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-8-12 padding-top">
            <Link id={`search_again_link`} title="Search again link" className="link" to="/keyworker/search" >&lt; Search again</Link>
            <h1 className="heading-large">Profile for {keyworkerDisplayName}</h1>
          </div>
          {renderContent}
        </div>
      </div>
    );
  }
}

KeyworkerProfile.propTypes = {
  keyworkerAllocations: PropTypes.array,
  keyworker: PropTypes.object.isRequired
};


export default KeyworkerProfile;
