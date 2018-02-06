import React, { Component } from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import KeyworkerReason from './KeyworkerReason.js';
import PropTypes from 'prop-types';
import axiosWrapper from './backendWrapper';

import './allocation.scss';

class AllocateParent extends Component {
  constructor (props) {
    super();
    this.displayError = this.displayError.bind(this);
    this.gotoManualAllocation = this.gotoManualAllocation.bind(this);
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
    this.state = {
      error: null,
      page: 0,
      list: [],
      allocatedKeyworkers: []
    };
  }

  async componentWillMount () {
    try {
      const list = await this.getUnallocated();
      this.setState({
        error: null,
        page: 1,
        list: list,
        allocatedKeyworkers: []
      });
    } catch (error) {
      this.displayError(error);
    }
  }

  async getUnallocated () {
    const response = await axiosWrapper.get('/unallocated', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: this.props.agencyId
      }
    });
    return response.data;
  }

  async getAllocated () {
    const response = await axiosWrapper.get('/allocated', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: this.props.agencyId,
        allocationType: 'A'
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, bookingId) {
    const allocatedKeyworkers = this.state.allocatedKeyworkers;

    allocatedKeyworkers[index] = {
      staffId: event.target.value,
      bookingId: bookingId
    };

    this.setState({
      allocatedKeyworkers
    });
  }

  async postManualOverride (history) {
    try {
      if (this.state.allocatedKeyworkers && this.state.allocatedKeyworkers > 1) {
        await axiosWrapper.post('/manualoverride', { allocatedKeyworkers: this.state.allocatedKeyworkers }, {
          headers: {
            jwt: this.props.jwt
          }
        });
      }
      this.props.onFinishAllocation(history);
      // return response.data;
    } catch (error) {
      this.displayError(error);
    }
  }

  displayError (error) {
    this.setState({
      page: this.state.page,
      list: [],
      allocatedKeyworkers: [],
      error: (error.response && error.response.data) || 'Something went wrong: ' + error
    });
  }

  async gotoManualAllocation () {
    try {
      const viewModel = await this.getAllocated();
      this.setState({
        page: 2,
        allocatedList: viewModel.allocatedResponse,
        keyworkerList: viewModel.keyworkerResponse,
        allocatedKeyworkers: []
      });
    } catch (error) {
      this.displayError(error);
    }
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
        return (<ManualAllocation allocatedKeyworkers={this.state.allocatedKeyworkers} allocatedList={this.state.allocatedList} keyworkerList={this.state.keyworkerList}
          handleKeyworkerChange={this.handleKeyworkerChange} postManualOverride={this.postManualOverride} {...this.props} />);
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
  allocatedKeyworkers: PropTypes.array,
  jwt: PropTypes.string,
  agencyId: PropTypes.string
};

export default AllocateParent;
