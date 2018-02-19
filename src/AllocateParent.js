import React, { Component } from 'react';
import Unallocated from './Unallocated.js';
import ManualAllocation from './ManualAllocation.js';
import PropTypes from 'prop-types';
import axiosWrapper from './backendWrapper';
import moment from 'moment';
import { setUnallocatedList, setAllocatedDetails, setCurrentPage, manualOverride, manualOverrideDateFilter, setError } from './actions';
import { connect } from 'react-redux';

import './allocation.scss';

class AllocateParent extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
    this.gotoManualAllocation = this.gotoManualAllocation.bind(this);
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
    this.applyDateFilter = this.applyDateFilter.bind(this);
  }

  async componentWillMount () {
    try {
      const list = await this.getUnallocated(this.props.agencyId);
      this.props.unallocatedListDispatch(list);
      this.props.setCurrentPageDispatch(1);
    } catch (error) {
      this.displayError(error);
    }
  }

  //TODO do we need this after redux
  async componentWillReceiveProps (nextProps) {
    if (nextProps.agencyId !== this.props.agencyId) {
      try {
        const list = await this.getUnallocated(nextProps.agencyId);
        this.props.unallocatedListDispatch(list);
        this.props.setCurrentPageDispatch(1);
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
        fromDate: this.props.fromDate,
        toDate: this.props.toDate
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, bookingId) {
    const allocatedKeyworkers = [...this.props.allocatedKeyworkers];

    if (event.target.value === '--') {
      allocatedKeyworkers[index] = null;
    } else {
      allocatedKeyworkers[index] = {
        staffId: event.target.value,
        bookingId: bookingId
      };
    }
    this.props.manualOverrideDispatch(allocatedKeyworkers);
  }

  handleDateFilterChange (date, name) {
    if (date) {
      this.props.manualOverrideDateFilterDispatch(name, moment(date).format('DD/MM/YYYY'));
    }
  }

  async postManualOverride (history) {
    try {
      await axiosWrapper.post('/manualoverride', { allocatedKeyworkers: this.props.allocatedKeyworkers }, {
        headers: {
          jwt: this.props.jwt
        }
      });
      this.props.onFinishAllocation(history);
    } catch (error) {
      this.displayError(error);
    }
  }

  displayError (error) {
    this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  async gotoManualAllocation () {
    try {
      const viewModel = await this.getAllocated();
      this.props.setCurrentPageDispatch(2);
      this.props.allocatedDetailsDispatch(viewModel.allocatedResponse, viewModel.keyworkerResponse);
    } catch (error) {
      this.displayError(error);
    }
  }

  async applyDateFilter () {
    this.gotoManualAllocation();
  }

  render () {
    if (this.props.error) {
      return (<div className="error-summary">
        <div className="error-message">
          <div> {this.props.error.message || this.props.error} </div>
        </div>
      </div>);
    }
    switch (this.props.page) {
      case 1:
        return <Unallocated gotoNext={this.gotoManualAllocation} {...this.props} />;
      case 2:
        return (<ManualAllocation displayDateFilter handleKeyworkerChange={this.handleKeyworkerChange} postManualOverride={this.postManualOverride}
          applyDateFilter={this.applyDateFilter} handleDateFilterChange={this.handleDateFilterChange} {...this.props} />);
      default:
        return "";
    }
  }
}

AllocateParent.propTypes = {
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  unallocatedList: PropTypes.array,
  allocatedList: PropTypes.array,
  allocatedKeyworkers: PropTypes.array,
  jwt: PropTypes.string.isRequired,
  onFinishAllocation: PropTypes.func.isRequired,
  agencyId: PropTypes.string.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  unallocatedListDispatch: PropTypes.func.isRequired,
  allocatedDetailsDispatch: PropTypes.func.isRequired,
  manualOverrideDispatch: PropTypes.func.isRequired,
  manualOverrideDateFilterDispatch: PropTypes.func.isRequired,
  setCurrentPageDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    unallocatedList: state.unallocated.unallocatedList,
    page: state.app.page,
    jwt: state.app.jwt,
    allocatedList: state.allocated.allocatedList,
    keyworkerList: state.allocated.keyworkerList,
    allocatedKeyworkers: state.allocated.allocatedKeyworkers,
    fromDate: state.allocated.fromDate,
    toDate: state.allocated.toDate,
    error: state.app.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    unallocatedListDispatch: list => dispatch(setUnallocatedList(list)),
    allocatedDetailsDispatch: (allocatedList, keyworkerList) => dispatch(setAllocatedDetails(allocatedList, keyworkerList)),
    manualOverrideDispatch: allocatedKeyworkers => dispatch(manualOverride(allocatedKeyworkers)),
    manualOverrideDateFilterDispatch: (dateName, date) => dispatch(manualOverrideDateFilter(dateName, date)),
    setCurrentPageDispatch: page => dispatch(setCurrentPage(page)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

const AllocateParentContainer = connect(mapStateToProps, mapDispatchToProps)(AllocateParent);

export {
  AllocateParent,
  AllocateParentContainer
};
