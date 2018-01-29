import React, { Component } from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import KeyworkerReason from './KeyworkerReason.js';

class AllocateParent extends Component {
  constructor (props) {
    super();
    console.log('in constructor AllocateParent() ' + props);
    this.state = {
      error: null,
      unallocatedOffenders: [],
      autoAllocatedOffenders: []
    };
    this.displayError = this.displayError.bind(this);
    this.setUnallocatedOffenders = this.setUnallocatedOffenders.bind(this);
    this.setAutoAllocatedOffenders = this.setAutoAllocatedOffenders.bind(this);
  }

  displayError (error) {
    this.setState({
      error: (error.response && error.response.data) || 'Something went wrong' + error
    });
  }

  setUnallocatedOffenders (list) {
    this.setState({
      error: null,
      unallocatedOffenders: list,
      autoAllocatedOffenders: []
    });
  }

  setAutoAllocatedOffenders (list) {
    this.setState({
      error: null,
      unallocatedOffenders: [],
      autoAllocatedOffenders: list
    });
  }

  render () {
    switch (this.props.page) {
      case 1:
        return (<Unallocated list={this.state.unallocatedOffenders} displayError={this.displayError} setUnallocatedOffenders={this.setUnallocatedOffenders} {...this.props} />);
      case 2:
        return <ManualAllocation setAutoAllocatedOffenders={this.setAutoAllocatedOffenders} {...this.props} />;
      case 3:
        return <KeyworkerReason {...this.props} />;
      default:
    }
  }
}

export default AllocateParent;
