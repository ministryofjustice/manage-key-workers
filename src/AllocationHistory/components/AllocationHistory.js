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
      const kwName = properCaseName(a.firstName) + ' ' + properCaseName(a.lastName);
      const createdStaff = properCaseName(a.userId.firstName) + ' ' + properCaseName(a.userId.lastName);
      const lastModStaff = properCaseName(a.lastModifiedByUser.firstName) + ' ' + properCaseName(a.lastModifiedByUser.lastName);
      const keyworkerHref = '/keyworker/' + a.staffId + '/profile';
      return (
        <tr key={a.offenderKeyworkerId}>
          <td className="row-gutters"><a className="link" href={keyworkerHref}>{kwName}</a></td>
          <td className="row-gutters">{a.prisonId}</td>
          <td className="row-gutters">{renderDateTime(a.assigned)}</td>
          <td className="row-gutters">{a.allocationReason}</td>
          <td className="row-gutters">{createdStaff}</td>
          <td className="row-gutters">{a.active ? '--' : renderDateTime(a.expired)}</td>
          <td className="row-gutters">{a.active ? '--' : lastModStaff}</td>
          <td className="row-gutters">{a.active ? '--' : a.deallocationReason}</td>
          <td className="row-gutters">{a.active ? 'Current' : 'Previous'}</td>
        </tr>
      );
    });

    let renderContent = null;

    renderContent = (<div>
      <div className="pure-u-md-12-12">
        <div className="padding-bottom-40">
          <table>
            <thead>
              <tr>
                <th>Name of key worker</th>
                <th>Establishment</th>
                <th>Allocation <br/> date &amp; time</th>
                <th>Allocation <br/> type</th>
                <th>Allocated By</th>
                <th>Removal <br/> date &amp; time</th>
                <th>Removed by</th>
                <th>Reason</th>
                <th>Status</th>
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
            <h1 className="heading-large margin-top">Key worker allocation history</h1>
          </div>
          <div className="padding-top">

            <div className="pure-u-md-5-12">
              <div className="pure-u-md-5-12" >
                <label className="form-label" htmlFor="name">Prisoner Name</label>
                <div className="bold padding-top-small">{offenderDisplayName}</div>
              </div>
              <div className="pure-u-md-3-12" >
                <label className="form-label" htmlFor="name">Prisoner no.</label>
                <div className="bold padding-top-small">{this.props.allocationHistory.offender.offenderNo}</div>
              </div>
              <div className="pure-u-md-4-12" >
                <label className="form-label" htmlFor="name">Total key workers</label>
                <div className="bold padding-top-small">{this.props.allocationHistory.allocationHistory.length}</div>
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
