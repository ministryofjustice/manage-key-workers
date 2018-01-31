import React, { Component } from 'react';

class KeyworkerReason extends Component {
  render () {
    if (!this.props.list) {
      return <div><p> Nothing to show (WIP)</p><button className="button top-gutter" onClick={() => this.props.onFinishAllocation(this.props.history)}>Save and continue</button></div>;
    }
    const offenders = this.props.list.map((a) => {
      return (
        <tr key={a.bookingId}>
          <td className="row-gutters"><a href={a.bookingId}>{a.lastName}, {a.firstName}</a></td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">prev todo</td>
          <td className="row-gutters">new todo</td>
          <td className="row-gutters"><select /></td>
        </tr>
      );
    });
    return (
      <div>
        <div className="pure-u-md-7-12">
          <h1 className="heading-large">Key workers changed</h1>
          <p>The following prisoners have had their key workers changed to new ones. The key workers have been notified of the change.</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>NOMS ID</th>
                <th>Location</th>
                <th>Previous key worker</th>
                <th>New key worker</th>
                <th>Reason for change</th>
              </tr>
            </thead>
            <tbody>{offenders}</tbody>
          </table>
        </div>
        <div>
          <button className="button top-gutter" onClick={() => this.props.onFinishAllocation(this.props.history)}>Save and continue</button>
        </div>
      </div>
    );
  }
}

export default KeyworkerReason;
