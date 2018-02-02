import React, { Component } from 'react';
import { properCaseName } from './stringUtils';
import ReactTooltip from 'react-tooltip';

class ManualAllocation extends Component {
  constructor (props) {
    super();
    this.state = {
      keyworker: ''
    };
    console.log('in constructor ManualAllocation() ' + props);
  }

  handleKeyworkerChange () {
    console.log('in handleKeyworkerChange');
  }

  render () {
    const keyworkerOptions = this.props.keyworkerList.map((kw) => {
      return <option value={kw.staffId}>{kw.lastName}, {kw.firstName} ({kw.numberAllocated})</option>;
    });

    const offenders = this.props.allocatedList.map((a) => {
      const formattedName = (properCaseName(a.lastName) + ', ' + properCaseName(a.firstName));
      let tooltip = '';
      if (a.keyworkerDisplay !== '--') {
        tooltip = (<span data-tip={`${a.numberAllocated} allocated`} className="tooltipSpan"><img
          alt="current Key worker allocation" className="tooltipImage" src="images/icon-information.png"/></span>);
      }
      return (
        <tr key={a.bookingId} className="row-gutters">
          <td className="row-gutters"><a href={a.bookingId}>{formattedName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{a.confirmedReleaseDate}</td>
          <td className="row-gutters">{a.crsaClassification}</td>
          <td className="row-gutters">{a.keyworkerDisplay}
            {tooltip}
            <ReactTooltip place="top" effect="solid" theme="info" />
          </td>
          <td className="row-gutters">
            <select id="keyworker-select" className="form-control" value={this.state.keyworker} onChange={this.handleKeyworkerChange}>
              {keyworkerOptions}
            </select>
          </td>
        </tr>
      );
    });
    return (
      <div>
        <h1 className="heading-large">Key worker allocation</h1>
        <p>These prisoners below have been automatically allocated to a Key worker. Use the drop down menu on the right to override it. The number in the brackets indicates the current total of allocated prisoners to each Key worker.</p>
        <table>
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
        <button className="button top-gutter pure-u-md-2-12" onClick={() => this.props.gotoNext()}>Allocate</button>
      </div>
    );
  }
}

export default ManualAllocation;
