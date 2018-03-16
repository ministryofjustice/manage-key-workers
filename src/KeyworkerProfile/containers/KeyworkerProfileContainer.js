import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerAllocationList, setKeyworker, setKeyworkerChangeList, setAvailableKeyworkerList, setKeyworkerCapacity, setMessage } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfile from '../components/KeyworkerProfile';
import Error from '../../Error';
import { withRouter } from 'react-router';

import axiosWrapper from "../../backendWrapper";

class KeyworkerProfileContainer extends Component {
  constructor () {
    super();
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this);
    this.postAllocationChange = this.postAllocationChange.bind(this);
    this.handleEditProfileClick = this.handleEditProfileClick.bind(this);
  }

  async componentWillMount () {
    try {
      await this.getKeyworkerProfile();
      await this.getKeyworkerAllocations();
    } catch (error) {
      this.props.displayError(error);
    }
  }

  async getKeyworkerProfile () {
    const keyworker = await this.makeKeyworkerProfileCall(this.props.match.params.staffId);
    this.props.keyworkerDispatch(keyworker);
  }


  async getKeyworkerAllocations () {
    const allocationsViewModel = await this.makeKeyworkerAllocationsCall(this.props.agencyId, this.props.match.params.staffId);
    this.props.keyworkerAllocationsDispatch(allocationsViewModel.allocatedResponse);
    this.props.availableKeyworkerListDispatch(allocationsViewModel.keyworkerResponse);
  }


  async makeKeyworkerAllocationsCall (agencyId, staffId) {
    const response = await axiosWrapper.get('/api/keyworkerAllocations', {
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
    } else {
      keyworkerChangeList[index] = {
        staffId: event.target.value,
        offenderNo: offenderNo
      };
    }
    this.props.keyworkerChangeListDispatch(keyworkerChangeList);
  }

  async makeKeyworkerProfileCall (staffId) {
    const response = await axiosWrapper.get('/api/keyworker', {
      params: {
        staffId: staffId,
        agencyId: this.props.agencyId
      }
    });
    return response.data;
  }

  handleEditProfileClick (history) {
    // initialise capacity input with current capacity value
    this.props.keyworkerCapacityDispatch(this.props.keyworker.capacity);
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  async postAllocationChange (history) {
    try {
      if (this.props.keyworkerChangeList && this.props.keyworkerChangeList.length > 0) {
        await axiosWrapper.post('/api/manualoverride', { allocatedKeyworkers: this.props.keyworkerChangeList }, { params: { agencyId: this.props.agencyId } });
        this.props.setMessageDispatch('Offender allocation updated.');
      }
      history.push('/');
    } catch (error) {
      this.props.displayError(error);
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfile handleKeyworkerChange={this.handleKeyworkerChange} handleAllocationChange={this.postAllocationChange} handleEditProfileClick={this.handleEditProfileClick} {...this.props} />;
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  path: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  keyworkerChangeList: PropTypes.array,
  keyworker: PropTypes.object,
  keyworkerChangeListDispatch: PropTypes.func,
  availableKeyworkerListDispatch: PropTypes.func,
  keyworkerCapacityDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
    keyworker: state.keyworkerSearch.keyworker,
    keyworkerChangeList: state.keyworkerSearch.keyworkerChangeList,
    keyworkerList: state.keyworkerSearch.keyworkerList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
    keyworkerDispatch: id => dispatch(setKeyworker(id)),
    keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
    availableKeyworkerListDispatch: list => dispatch(setAvailableKeyworkerList(list)),
    keyworkerCapacityDispatch: capacity => dispatch(setKeyworkerCapacity(capacity)),
    setMessageDispatch: (message) => dispatch(setMessage(message))
  };
};

export { KeyworkerProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileContainer));

