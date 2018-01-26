import React, { Component } from 'react';
import axios from 'axios';

class Unallocated extends Component {
  constructor (props) {
    super();
    console.log('in constructor ' + props.jwt);
    this.state = {
      error: null
    };
    console.log('component ');
  }

  componentWillMount () {
    console.log('in componentWillMount');
    axios.get('/unallocated', {
      headers: {
        jwt: this.props.jwt
      }
    }).then(data => {
      console.log('data from api call ' + this.props.data);
    })
      .catch(error => {
        this.setState({
          error: error.response && error.response.data || 'Something went wrong'
        });
      });
  }

  render () {
    return (
      <div>hello
      </div>

    );
  }
}

export default Unallocated;
