import React, { Component } from 'react';
import axios from 'axios';

class Unallocated extends Component {
  constructor (props) {
    super();
    console.log('in constructor ' + props.jwt);
  }

  componentWillMount () {
    console.log('in componentWillMount');
    axios.get('/unallocated', {
      headers: {
        jwt: this.props.jwt
      }
    }).then(response => {
      console.log('data from api call ' + response);
      this.props.setUnallocatedOffenders(response.data);
    })
      .catch(error => {
        this.props.displayError(error);
      });
  }

  render () {
    const offenders = this.props.list.map((a) => {
      return (
        <tr>
          <td><a href={a.bookingId}>{a.lastName}, {a.firstName}</a></td>
          <td>{a.offenderNo}</td>
          <td>{a.internalLocationDesc}</td>
          <td>release date todo</td>
          <td>csra todo</td>
        </tr>
    )});
    return (
      <div>
        <div className="pure-u-md-8-12">
          <h1 className="heading-large">Prisoners without key workers</h1>
          <p>These prisoners have not yet been allocated a Key worker. Use the button below to automatically allocate
            them to one. You can override the selections on the next page if you wish.</p>
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
        </div>
        <div>
          <button className="button pure-u-md-2-12" onClick={() => this.jumpTo('asdf')}>Allocate</button>
        </div>
      </div>
    )
  }
}

export default Unallocated;
