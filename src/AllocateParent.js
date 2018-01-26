import React, {Component} from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import KeyworkerReason from './KeyworkerReason.js';

class AllocateParent extends Component {
  constructor(props) {
    super();
    console.log('in constructor AllocateParent() ' + props);
    this.state = {
      error: null,
      unallocatedOffenders: [],
      autoAllocatedOffenders: []
    };
    this.displayError = this.displayError.bind(this);
  }

  displayError(error) {
    this.setState({
      error: (error.response && error.response.data) || 'Something went wrong' + error
    });
  }

  render() {
    switch (this.props.page) {
      case 1:
        return <Unallocated displayError={this.displayError} jwt={this.props.jwt} />
        break;
      case 2:
        return <ManualAllocation displayError={this.displayError} jwt={this.props.jwt}/>
        break;
      case 3:
        return <KeyworkerReason displayError={this.displayError} jwt={this.props.jwt}/>
        break;
    }
  }
}

export default AllocateParent;
