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
    }).then(data => {
      console.log('data from api call ' + data);
      this.props.setUnallocatedOffenders(data);
    })
      .catch(error => {
        this.props.displayError(error);
      });
  }

  render () {
    const offenders = this.props.list.map((a) => {
      return (
        <li>{a}</li>);
    });
    return (
      <div>
        <ol>{offenders}</ol>
        <button onClick={() => this.jumpTo('asdf')}>Allocate</button>
      </div>
    )
  }
}

export default Unallocated;
