import React, { Component } from 'react';
import { properCaseName } from './stringUtils';
import ReactTooltip from 'react-tooltip';

class ManualAllocation extends Component {
  constructor (props) {
    super();
    console.log('in constructor ManualAllocation() ' + props);
  }

  render () {
    const offenders = this.props.list.map((a) => {
      const formattedKeyworkerName = (properCaseName(a.keyworkerLastName) + ', ' + properCaseName(a.keyworkerFirstName));
      const formattedName = (properCaseName(a.lastName) + ', ' + properCaseName(a.firstName));
      return (
        <tr key={a.bookingId}>
          <td><a href={a.bookingId}>{formattedName}</a></td>
          <td>{a.offenderNo}</td>
          <td>{a.internalLocationDesc}</td>
          <td>release date todo</td>
          <td>csra todo</td>
          <td>{formattedKeyworkerName}
            <span data-tip={`${a.numberAllocated} allocated`} className="tooltipSpan"><img className="tooltipImage" src="images/icon-information.png"/></span>
            <ReactTooltip place="top" effect="solid" theme="info" />
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
              <th>RD</th>
              <th>CSRA</th>
              <th>Allocated Key worker</th>
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
