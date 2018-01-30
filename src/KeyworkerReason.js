import React, { Component } from 'react';
import axios from 'axios';

class KeyworkerReason extends Component {
  constructor (props) {
    super();
    console.log('in constructor KeyworkerReason() ' + props);
  }

  async componentWillMount () {
    console.log('in componentWillMount');
    try {
      // TODO should push reasons list
      const response = await axios.put('/update-reason', {
        headers: {
          jwt: this.props.jwt
        }
      });
      console.log('data from api call ' + response);
      // list returned is of offenders with old + new KWs
      this.props.setSavedOffenders(response.data);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    if (!this.props.list) return "Nothing to show (WIP)";
    const offenders = this.props.list.map((a) => {
      return (
        <tr className="data-item">
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
          <button className="button top-gutter" onClick={() => this.props.onSaveReasons(this.props.history)}>Save and continue</button>
        </div>
      </div>
    );
  }
}

export default KeyworkerReason;
