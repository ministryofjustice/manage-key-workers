import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Provisional from '../components/Provisional';
import { setAllocatedDetails, manualOverride, setMessage, setLoaded } from '../../redux/actions/index';
import ErrorComponent from '../../Error/index';
import Spinner from '../../Spinner';

import '../../allocation.scss';

class ProvisionalContainer extends Component {
  constructor (props) {
    super();
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postManualOverride = this.postManualOverride.bind(this);
    props.setLoadedDispatch(false);
  }

  async componentWillMount () {
    const { user, history, allocatedDetailsDispatch, manualOverrideDispatch, handleError, setLoadedDispatch } = this.props;

    try {
      if (!user || !user.writeAccess) {
        history.push('/');
        return;
      }
      const viewModel = await this.getAllocated();
      allocatedDetailsDispatch(viewModel.allocatedResponse, viewModel.keyworkerResponse);
      manualOverrideDispatch([]);
      if (viewModel.warning) {
        handleError({
          response: {
            data: `${viewModel.warning 
          } Please try allocating manually, adding more Key workers or raising their capacities.`
          }
        });
      }
    } catch (error) {
      handleError(error);
    }
    setLoadedDispatch(true);
  }

  async getAllocated () {
    const { agencyId, fromDate, toDate } = this.props;
    const response = await axios.get('/api/allocated', {
      params: {
        agencyId,
        allocationType: 'A',
        fromDate,
        toDate
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, offenderNo) {
    const { allocatedKeyworkers, manualOverrideDispatch, handleError } = this.props;

    try {
      const allocatedKeyworkersList = [...allocatedKeyworkers];

      if (event.target.value === '--') {
        allocatedKeyworkersList[index] = null;
      } else {
        allocatedKeyworkersList[index] = {
          staffId: event.target.value,
          offenderNo
        };
      }
      manualOverrideDispatch(allocatedKeyworkersList);
    } catch (error) {
      handleError(error);
    }
  }

  async postManualOverride (history) {
    const { agencyId, allocatedKeyworkers, setMessageDispatch, onFinishAllocation, handleError } = this.props;

    try {
      await axios.post('/api/autoAllocateConfirmWithOverride', { allocatedKeyworkers }, {
        params: {
          agencyId
        }
      });
      setMessageDispatch('Key workers successfully updated.');
      onFinishAllocation(history);
    } catch (error) {
      handleError(error);
    }
  }

  render () {
    const { loaded } = this.props;

    if (loaded) {
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
  loaded: PropTypes.bool,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    allocatedList: state.allocated.allocatedList,
    keyworkerList: state.allocated.keyworkerList,
    allocatedKeyworkers: state.allocated.allocatedKeyworkers,
    message: state.app.message,
    agencyId: state.app.user.activeCaseLoadId,
    loaded: state.app.loaded
  });

const mapDispatchToProps = dispatch => ({
    allocatedDetailsDispatch: (allocatedList, keyworkerList) => dispatch(setAllocatedDetails(allocatedList, keyworkerList)),
    manualOverrideDispatch: allocatedKeyworkers => dispatch(manualOverride(allocatedKeyworkers)),
    setMessageDispatch: message => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  });

export { ProvisionalContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProvisionalContainer));
