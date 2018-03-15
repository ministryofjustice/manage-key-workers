import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerAllocationList, setKeyworker, setKeyworkerChangeList, setAvailableKeyworkerList, setMessage } from '../../redux/actions/index';
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
    await this.getKeyworkerProfile();
    await this.getKeyworkerAllocations();
  }

  async getKeyworkerProfile () {
    try {
      const keyworker = await this.makeKeyworkerProfileCall(this.props.match.params.staffId);
      this.props.keyworkerDispatch(keyworker);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  async getKeyworkerAllocations () {
    try {
      const allocationsViewModel = await this.makeKeyworkerAllocationsCall(this.props.agencyId, this.props.match.params.staffId);
      this.props.keyworkerAllocationsDispatch(allocationsViewModel.allocatedResponse);
      this.props.availableKeyworkerListDispatch(allocationsViewModel.keyworkerResponse);
    } catch (error) {
      this.props.displayError(error);
    }
  }


  async makeKeyworkerAllocationsCall (agencyId, staffId) {
    const response = await axiosWrapper.get('/keyworkerAllocations', {
      headers: {
        jwt: this.props.jwt
      },
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
    const response = await axiosWrapper.get('/keyworker', {
      headers: {
        jwt: this.props.jwt
      },
      params: {
        staffId: staffId
      }
    });
    return response.data;
  }

  handleEditProfileClick (history) {
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  async postAllocationChange (history) {
    try {
      if (this.props.keyworkerChangeList && this.props.keyworkerChangeList.length > 0) {
        await axiosWrapper.post('/manualoverride', { allocatedKeyworkers: this.props.keyworkerChangeList }, {
          headers: {
            jwt: this.props.jwt
          },
          params: {
            agencyId: this.props.agencyId
          }
        });
        this.props.setMessageDispatch('Offender allocation updated.');
      }
      history.push('/home');
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
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  keyworkerChangeList: PropTypes.array,
  keyworker: PropTypes.object,
  keyworkerChangeListDispatch: PropTypes.func,
  availableKeyworkerListDispatch: PropTypes.func
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
    setMessageDispatch: (message) => dispatch(setMessage(message))
  };
};

export { KeyworkerProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileContainer));

