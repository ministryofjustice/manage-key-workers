import React, { Component } from 'react';
import Provisional from '../components/Provisional.js';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setAllocatedDetails, manualOverride, setMessage, setLoaded } from '../../redux/actions/index';
import ErrorComponent from '../../Error/index';
import { connect } from 'react-redux';
import Spinner from '../../Spinner';

import '../../allocation.scss';
import { withRouter } from 'react-router';

class ProvisionalContainer extends Component {
  constructor (props) {
    super();
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
    props.setLoadedDispatch(false);
  }

  async componentWillMount () {
    try {
      const viewModel = await this.getAllocated();
      this.props.allocatedDetailsDispatch(viewModel.allocatedResponse, viewModel.keyworkerResponse);
      this.props.manualOverrideDispatch([]);
      if (viewModel.warning) {
        this.props.handleError({
          response: {
            data: viewModel.warning +
          ' Please try allocating manually, adding more Key workers or raising their capacities.'
          }
        });
      }
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getAllocated () {
    const response = await axios.get('/api/allocated', {
      params: {
        agencyId: this.props.agencyId,
        allocationType: 'A',
        fromDate: this.props.fromDate,
        toDate: this.props.toDate
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, offenderNo) {
    try {
      const allocatedKeyworkers = [...this.props.allocatedKeyworkers];

      if (event.target.value === '--') {
        allocatedKeyworkers[index] = null;
      } else {
        allocatedKeyworkers[index] = {
          staffId: event.target.value,
          offenderNo: offenderNo
        };
      }
      this.props.manualOverrideDispatch(allocatedKeyworkers);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  async postManualOverride (history) {
    try {
      await axios.post('/api/autoAllocateConfirmWithOverride', { allocatedKeyworkers: this.props.allocatedKeyworkers }, {
        params: {
          agencyId: this.props.agencyId
        }
      });
      this.props.setMessageDispatch('Key workers successfully updated.');
      this.props.onFinishAllocation(history);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  render () {
    if (this.props.loaded) {
      return (<div>
        <ErrorComponent {...this.props} />
        {
          <Provisional handleKeyworkerChange={this.handleKeyworkerChange}
            postManualOverride={this.postManualOverride} {...this.props} />
        }
      </div>
      );
    }
    return <Spinner />;
  }
}

ProvisionalContainer.propTypes = {
  error: PropTypes.string,
  handleError: PropTypes.func.isRequired,
  allocatedList: PropTypes.array,
  allocatedKeyworkers: PropTypes.array,
  onFinishAllocation: PropTypes.func.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  allocatedDetailsDispatch: PropTypes.func.isRequired,
  manualOverrideDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    allocatedList: state.allocated.allocatedList,
    keyworkerList: state.allocated.keyworkerList,
    allocatedKeyworkers: state.allocated.allocatedKeyworkers,
    message: state.app.message,
    agencyId: state.app.user.activeCaseLoadId,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    allocatedDetailsDispatch: (allocatedList, keyworkerList) => dispatch(setAllocatedDetails(allocatedList, keyworkerList)),
    manualOverrideDispatch: allocatedKeyworkers => dispatch(manualOverride(allocatedKeyworkers)),
    setMessageDispatch: message => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { ProvisionalContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProvisionalContainer));
