import React, { Component } from 'react';
import { properCaseName } from './stringUtils';

class ManualAllocation extends Component {
  constructor (props) {
    super();
    console.log('in constructor ManualAllocation() ' + props);
  }

  render () {
    const offenders = this.props.list.map((a) => {
      const formattedName = (properCaseName(a.lastName) + ', ' + properCaseName(a.firstName));
      return (
        <tr key={a.bookingId}>
          <td><a href={a.bookingId}>{formattedName}</a></td>
          <td>{a.offenderNo}</td>
          <td>{a.internalLocationDesc}</td>
          <td>release date todo</td>
          <td>csra todo</td>
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
            </tr>
          </thead>
          <tbody>{offenders}</tbody>
        </table>
        <button className="button pure-u-md-2-12" onClick={() => this.props.gotoNext()}>Allocate</button>
      </div>
    );
  }
}

export default ManualAllocation;
