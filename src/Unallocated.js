import React, {Component} from 'react';
import axios from 'axios';

class Unallocated extends Component {
  constructor() {
    super();
    console.log('in constructor');
    this.state = {
      error: null,
    }
    console.log('component ');
  }

  componentWillMount() {
    console.log('in console will');
    axios.get('/unallocated').then(data => {
      console.log('data from api call ' + this.props.data);
    })
      .catch(error => {
        this.setState({
          error: error.response.data || 'Something went wrong',
        })
      })
  }

  render() {
    return (
      <div>hello
      </div>

    );
  }
}

export default Unallocated