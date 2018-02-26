import React, { Component } from 'react';
import { properCaseName } from '../stringUtils';
import ReactTooltip from 'react-tooltip';
import DateFilter from '../DateFilter/index.js';
import PropTypes from 'prop-types';

class ManualAllocation extends Component {
  buildTableForRender (keyworkerOptions) {
    const offenders = this.props.allocatedList.map((a, index) => {
      const currentSelectValue = this.props.allocatedKeyworkers[index] ? this.props.allocatedKeyworkers[index].staffId : '';
      let tooltip = '';
      if (a.keyworkerDisplay !== '--') {
        tooltip = (<span data-tip={`${a.numberAllocated} allocated`} className="tooltipSpan"><img
          alt="current Key worker allocation" className="tooltipImage" src="images/icon-information.png"/></span>);
      }
      return (
        <tr key={a.bookingId} className="row-gutters">
          <td className="row-gutters"><a
            href={a.bookingId}>{properCaseName(a.lastName)}, {properCaseName(a.firstName)}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{a.confirmedReleaseDate}</td>
          <td className="row-gutters">{a.crsaClassification}</td>
          <td className="row-gutters">{a.keyworkerDisplay}
            {tooltip}
            <ReactTooltip place="top" effect="solid" theme="info"/>
          </td>
          <td className="row-gutters">

            <select id={`keyworker-select-${a.bookingId}`} className="form-control" value={currentSelectValue}
              onChange={(event) => this.props.handleKeyworkerChange(event, index, a.bookingId)}>
              <option key="choose" value="--">-- Select --</option>
              {keyworkerOptions.filter(e => e.props.value !== a.staffId)}
            </select>
          </td>
        </tr>
      );
    });
    return offenders;
  }

  render () {
    const keyworkerOptions = this.props.keyworkerList.map((kw, optionIndex) => {
      return <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>{kw.lastName}, {kw.firstName} ({kw.numberAllocated})</option>;
    });
    const offenders = this.buildTableForRender(keyworkerOptions);
    return (
      <div>
        <div className="pure-g">

          <div className="pure-u-md-7-12"><h1 className="heading-large">Key worker allocation</h1><p>These prisoners below have been automatically allocated to a Key worker. Use the drop down menu on the right to override it.
          The number in the brackets indicates the current total of allocated prisoners to each Key worker.</p></div>
          {this.props.displayDateFilter && <div className="pure-u-md-5-12"><DateFilter {...this.props} /></div>}
        </div>
        <table className="row-gutters">
          <thead>
            <tr>
              <th>Name</th>
              <th>NOMS ID</th>
              <th>Location</th>
              <th>CRD</th>
              <th>CSRA</th>
              <th>Allocated Key worker</th>
              <th>Assign to new key worker</th>
            </tr>
          </thead>
          <tbody>{offenders}</tbody>
        </table>
        <button className="button top-gutter pure-u-md-5-24" onClick={() => this.props.postManualOverride(this.props.history)}>Save and return to menu</button>
      </div>
    );
  }
}

ManualAllocation.propTypes = {
  displayDateFilter: PropTypes.bool,
  allocatedList: PropTypes.array,
  keyworkerList: PropTypes.array,
  history: PropTypes.object,
  allocatedKeyworkers: PropTypes.array,
  handleKeyworkerChange: PropTypes.func.isRequired,
  postManualOverride: PropTypes.func.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
};

export default ManualAllocation;
