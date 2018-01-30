import React, { Component } from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import KeyworkerReason from './KeyworkerReason.js';
import PropTypes from 'prop-types';
import './allocation.scss';
import axios from "axios/index";

class AllocateParent extends Component {
  constructor (props) {
    super();
    this.displayError = this.displayError.bind(this);
    this.gotoManualAllocation = this.gotoManualAllocation.bind(this);
    this.gotoKeyworkerReason = this.gotoKeyworkerReason.bind(this);
    this.state = {
      error: null,
      page: 0,
      list: []
    };
  }

  async componentWillMount () {
    const list = await this.getUnallocated();
    this.setState({
      error: null,
      page: 1,
      list: list
    });
  }

  async getUnallocated () {
    try {
      const response = await axios.get('/unallocated', {
        headers: {
          jwt: this.props.jwt
        }
      });
      console.log('data from api call ' + response);
      return response.data;
    } catch (error) {
      this.displayError(error);
    }
  }

  async getAllocated () {
    try {
      const response = await axios.get('/allocated', {
        headers: {
          jwt: this.props.jwt
        }
      });
      console.log('data from manual allocated api call ' + response.data);
      return response.data.allocatedResponse;
    } catch (error) {
      this.displayError(error);
    }
  }

  async getConfirmationList () {
    try {
      // TODO shouldnt do put here, should get confirmed manual allocs
      const response = await axios.put('/update-reason', {
        headers: {
          jwt: this.props.jwt
        }
      });
      console.log('data from api call ' + response);
      // list returned is of offenders with old + new KWs
      return response.data;
    } catch (error) {
      this.displayError(error);
    }
  }

  displayError (error) {
    this.setState({
      page: this.state.page,
      list: [],
      error: (error.response && error.response.data) || 'Something went wrong: ' + error
    });
  }

  async gotoManualAllocation () {
    this.setState({
      page: 2,
      list: await this.getAllocated()
    });
  }

  async gotoKeyworkerReason () {
    this.setState({
      page: 3,
      list: await this.getConfirmationList()
    });
  }

  render () {
    if (this.state.error) {
      return (<div className="error-summary">
        <div className="error-message">
          <div> {this.state.error} </div>
        </div>
      </div>);
    }
    switch (this.state.page) {
      case 1:
        return <Unallocated list={this.state.list} gotoNext={this.gotoManualAllocation} {...this.props} />;
      case 2:
        return <ManualAllocation list={this.state.list} gotoNext={this.gotoKeyworkerReason} {...this.props} />;
      case 3:
        return <KeyworkerReason list={this.state.list} {...this.props} />;
      default:
        return "";
    }
  }
}

AllocateParent.propTypes = {
  error: PropTypes.string,
  unallocatedOffenders: PropTypes.array,
  autoAllocatedOffenders: PropTypes.array,
  savedOffenders: PropTypes.array,
  jwt: PropTypes.string
};

export default AllocateParent;
