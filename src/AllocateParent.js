import React, { Component } from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import PropTypes from 'prop-types';
import axiosWrapper from './backendWrapper';
import moment from 'moment';

import './allocation.scss';

class AllocateParent extends Component {
  constructor (props) {
    super();
    this.displayError = this.displayError.bind(this);
    this.gotoManualAllocation = this.gotoManualAllocation.bind(this);
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
    this.applyDateFilter = this.applyDateFilter.bind(this);
    this.state = {
      error: null,
      page: 0,
      list: [],
      allocatedKeyworkers: [],
      toDate: '',
      fromDate: ''
    };
  }

  async componentWillMount () {
    try {
      const list = await this.getUnallocated(this.props.agencyId);
      this.setState({
        error: null,
        page: 1,
        list: list,
        allocatedKeyworkers: [],
        toDate: moment().format('DD/MM/YYYY'),
        fromDate: moment().subtract(2, "years").format('DD/MM/YYYY')
      });
    } catch (error) {
      this.displayError(error);
    }
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.agencyId !== this.props.agencyId) {
      try {
        const list = await this.getUnallocated(nextProps.agencyId);
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
  }

  async getUnallocated (agencyId) {
    const response = await axiosWrapper.get('/unallocated', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        agencyId: agencyId
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
        allocationType: 'A',
        fromDate: this.state.fromDate,
        toDate: this.state.toDate
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, bookingId) {
    const allocatedKeyworkers = this.state.allocatedKeyworkers;

    if (event.target.value === '--') {
      allocatedKeyworkers[index] = null;
    } else {
      allocatedKeyworkers[index] = {
        staffId: event.target.value,
        bookingId: bookingId
      };
    }

    this.setState({
      allocatedKeyworkers
    });
  }

  handleDateFilterChange (date, name) {
    if (date) {
      const newState = {};
      newState[name] = moment(date).format('DD/MM/YYYY');
      this.setState(newState);
    }
  }

  async postManualOverride (history) {
    try {
      await axiosWrapper.post('/manualoverride', { allocatedKeyworkers: this.state.allocatedKeyworkers }, {
        headers: {
          jwt: this.props.jwt
        }
      });
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

  async applyDateFilter () {
    this.gotoManualAllocation();
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
        return (<ManualAllocation displayDateFilter allocatedKeyworkers={this.state.allocatedKeyworkers}
          allocatedList={this.state.allocatedList} keyworkerList={this.state.keyworkerList}
          handleKeyworkerChange={this.handleKeyworkerChange} toDate={this.state.toDate} fromDate={this.state.fromDate}
          postManualOverride={this.postManualOverride} applyDateFilter={this.applyDateFilter} handleDateFilterChange={this.handleDateFilterChange} {...this.props} />);
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
  jwt: PropTypes.string.isRequired,
  onFinishAllocation: PropTypes.func.isRequired,
  agencyId: PropTypes.string.isRequired
};

export default AllocateParent;
