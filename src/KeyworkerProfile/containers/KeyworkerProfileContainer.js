import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import KeyworkerProfile from '../components/KeyworkerProfile';
import Error from '../../Error';
import { withRouter } from 'react-router';
import Spinner from '../../Spinner';

import {
  setKeyworkerAllocationList,
  setKeyworker,
  setKeyworkerChangeList,
  setAvailableKeyworkerList,
  setKeyworkerStatus,
  setKeyworkerCapacity,
  setMessage,
  setLoaded,
  setKeyworkerStats
} from '../../redux/actions/index';


import axios from 'axios';

class KeyworkerProfileContainer extends Component {
  constructor (props) {
    super();
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postAllocationChange = this.postAllocationChange.bind(this);
    this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
    this.getKeyworkerStats = this.getKeyworkerStats.bind(this);

    props.setLoadedDispatch(false);
  }

  async componentDidMount () {
    try {
      await this.getKeyworkerProfile();
      await this.getKeyworkerAllocations();
      await this.getKeyworkerStats();
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getKeyworkerProfile () {
    const keyworker = await this.makeKeyworkerProfileCall(this.props.match.params.staffId);
    this.props.keyworkerDispatch(keyworker);
  }


  async getKeyworkerAllocations () {
    const allocationsViewModel = await this.makeKeyworkerAllocationsCall(this.props.agencyId, this.props.match.params.staffId);
    this.props.keyworkerAllocationsDispatch(allocationsViewModel.allocatedResponse);
    this.props.availableKeyworkerListDispatch(allocationsViewModel.keyworkerResponse);
    this.props.keyworkerChangeListDispatch([]);
  }

  async getKeyworkerStats () {
    const format = 'YYYY-MM-DD';
    const fromDate = moment().subtract(1, 'month').format(format);
    const toDate = moment().format(format);

    const stats = await this.getKeyworkerStatsCall(this.props.match.params.staffId, fromDate, toDate);

    this.props.keyworkerStatsDispatch(stats);
  }

  async getKeyworkerStatsCall (staffId, fromDate, toDate) {
    const response = await axios.get('/api/keyworker-profile-stats', {
      params: {
        staffId,
        fromDate,
        toDate,
        period: 'month'
      }
    });

    return response.data;
  }


  async makeKeyworkerAllocationsCall (agencyId, staffId) {
    const response = await axios.get('/api/keyworkerAllocations', {
      params: {
        agencyId: agencyId,
        staffId: staffId
      }
    });
    return response.data;
  }

  handleKeyworkerChange (event, index, offenderNo) {
    const keyworkerChangeList = [...this.props.keyworkerChangeList];

    if (event.target.value === '--') {
      keyworkerChangeList[index] = null;
    } else if (event.target.value === '_DEALLOCATE') {
      keyworkerChangeList[index] = {
        deallocate: true,
        staffId: event.target.value,
        offenderNo: offenderNo
      };
    } else {
      keyworkerChangeList[index] = {
        staffId: event.target.value,
        offenderNo: offenderNo
      };
    }
    this.props.keyworkerChangeListDispatch(keyworkerChangeList);
  }

  async makeKeyworkerProfileCall (staffId) {
    const response = await axios.get('/api/keyworker', {
      params: {
        staffId: staffId,
        agencyId: this.props.agencyId
      }
    });
    return response.data;
  }

  handleEditProfileClick (history) {
    // initialise inputs with current capacity value
    this.props.keyworkerCapacityDispatch(this.props.keyworker.capacity.toString());
    this.props.keyworkerStatusDispatch(this.props.keyworker.status);
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  async postAllocationChange (history) {
    try {
      if (this.props.keyworkerChangeList && this.props.keyworkerChangeList.length > 0) {
        await axios.post('/api/manualoverride',
          {
            allocatedKeyworkers: this.props.keyworkerChangeList
          },
          {
            params:
              {
                agencyId: this.props.agencyId
              }
          });
        this.props.setMessageDispatch('Offender allocation updated.');
        this.props.keyworkerChangeListDispatch([]);
      }
      history.push('/');
    } catch (error) {
      this.props.handleError(error);
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<KeyworkerProfile handleKeyworkerChange={this.handleKeyworkerChange}
        handleAllocationChange={this.postAllocationChange}
        handleEditProfileClick={this.handleEditProfileClick} {...this.props} />);
    }

    return <Spinner />;
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  path: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  keyworkerChangeList: PropTypes.array,
  keyworker: PropTypes.object,
  keyworkerChangeListDispatch: PropTypes.func,
  availableKeyworkerListDispatch: PropTypes.func,
  keyworkerCapacityDispatch: PropTypes.func,
  keyworkerStatusDispatch: PropTypes.func,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
    keyworker: state.keyworkerSearch.keyworker,
    keyworkerChangeList: state.keyworkerSearch.keyworkerChangeList,
    keyworkerList: state.keyworkerSearch.keyworkerList,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
    keyworkerDispatch: id => dispatch(setKeyworker(id)),
    keyworkerStatsDispatch: stats => dispatch(setKeyworkerStats(stats)),
    keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
    availableKeyworkerListDispatch: list => dispatch(setAvailableKeyworkerList(list)),
    keyworkerCapacityDispatch: capacity => dispatch(setKeyworkerCapacity(capacity)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    keyworkerStatusDispatch: status => dispatch(setKeyworkerStatus(status))
  };
};

export { KeyworkerProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileContainer));

