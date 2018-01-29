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
        <td>{a.lastName}, {a.firstName}</td>
        <td>{a.offenderNo}</td>
        <td>{a.internalLocationDesc}</td>
        <td>release date todo</td>
        <td>csra todo</td>
        </tr>
    )});
    return (
      <div>
        <h1>Prisoners without key workers</h1>
        <div>These prisoners have not yet been allocated a Key worker. Use the button below to automatically allocate them to one. You can override the selections on the next page if you wish.</div>
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
        <button onClick={() => this.jumpTo('asdf')}>Allocate</button>
      </div>
    )
  }
}

export default Unallocated;
