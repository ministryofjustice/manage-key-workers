import React, { Component } from 'react';
import { properCaseName, renderDateTime } from "../../stringUtils";
import PropTypes from 'prop-types';
import MessageBar from "../../MessageBar/index";

class AllocationHistory extends Component {
  getCurrentKeyWorker () {
    let currentKw = '--';
    if (this.props.allocationHistory.allocationHistory.length > 0) {
      let topEntry = this.props.allocationHistory.allocationHistory[0];
      currentKw = topEntry.expired ? '--' : properCaseName(topEntry.lastName) + ', ' + properCaseName(topEntry.firstName);
    }
    return currentKw;
  }
  render () {
    const offenderDisplayName = properCaseName(this.props.allocationHistory.offender.firstName) + ' ' + properCaseName(this.props.allocationHistory.offender.lastName);
    const allocations = this.props.allocationHistory.allocationHistory.map((a, index) => {
      const kwName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      const createdStaff = properCaseName(a.createdByUser.lastName) + ', ' + properCaseName(a.createdByUser.firstName);
      const lastModStaff = properCaseName(a.lastModifiedByUser.lastName) + ', ' + properCaseName(a.lastModifiedByUser.firstName);
      const keyworkerHref = '/keyworker/' + a.staffId + '/profile';
      return (
        <tr key={a.offenderKeyworkerId}>
          <td className="row-gutters"><a className="link" href={keyworkerHref}>{kwName}</a></td>
          <td className="row-gutters">{a.prisonId}</td>
          <td className="row-gutters">{a.active}</td>
          <td className="row-gutters">{a.allocationType}</td>
          <td className="row-gutters">{renderDateTime(a.assigned)}</td>
          <td className="row-gutters">{renderDateTime(a.expired)}</td>
          <td className="row-gutters">{a.deallocationReason}</td>
          <td className="row-gutters">{createdStaff}</td>
          <td className="row-gutters">{renderDateTime(a.modifyDateTime)}</td>
          <td className="row-gutters">{lastModStaff}</td>
        </tr>
      );
    });

    let renderContent = null;

    renderContent = (<div>
      <div className="lede padding-top padding-bottom-large bold">Key worker allocation history ({this.props.allocationHistory.allocationHistory.length})</div>
      <div className="pure-u-md-12-12">
        <div className="padding-bottom-40">
          <table>
            <thead>
              <tr>
                <th>Key Worker Name</th>
                <th>Prison</th>
                <th>Active</th>
                <th>Allocation Type</th>
                <th>Assigned</th>
                <th>Expired</th>
                <th>Reason</th>
                <th>Created By</th>
                <th>Modified On</th>
                <th>Modified By</th>
              </tr>
            </thead>
            <tbody>{allocations}</tbody>
          </table>
        </div>
      </div>
    </div>
    );

    return (
      <div>
        <MessageBar {...this.props}/>
        <div className="pure-g padding-top padding-bottom-large">
          <div className="pure-u-md-8-12 padding-top">
            <h1 className="heading-large margin-top">Prisoner {offenderDisplayName}</h1>
          </div>
          <div className="padding-top">

            <div className="pure-u-md-5-12">
              <div className="pure-u-md-5-12" >
                <label className="form-label" htmlFor="name">Current key worker</label>
                <div className="bold padding-top-small">{this.getCurrentKeyWorker()}</div>
              </div>
              <div className="pure-u-md-4-12" >
                <label className="form-label" htmlFor="name">Current Location</label>
                <div className="bold padding-top-small">{this.props.allocationHistory.offender.agencyId} {this.props.allocationHistory.offender.assignedLivingUnitDesc}</div>
              </div>
              <div className="pure-u-md-1-12" >
                <label className="form-label" htmlFor="name">ID</label>
                <div className="bold padding-top-small">{this.props.allocationHistory.offender.offenderNo}</div>
              </div>
            </div>
          </div>
          <hr/>
          {renderContent}
        </div>
      </div>
    );
  }
}

AllocationHistory.propTypes = {
  allocationHistory: PropTypes.object,
  loaded: PropTypes.bool
};


export default AllocationHistory;
