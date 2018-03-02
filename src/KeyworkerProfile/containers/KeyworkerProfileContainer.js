import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerAllocationList, setKeyworker } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfile from '../components/KeyworkerProfile';
import Error from '../../Error';
import { withRouter } from 'react-router';

import axiosWrapper from "../../backendWrapper";

class KeyworkerProfileContainer extends Component {
  constructor () {
    super();
    this.getKeyworkerProfile = this.getKeyworkerProfile.bind(this);
  }

  componentWillMount () {
    this.getKeyworkerProfile();
  }

  async getKeyworkerProfile () {
    try {
      const keyworker = await this.getKeyworkerDetails(this.props.match.params.staffId);
      const allocations = await this.getKeyworkerAllocations(this.props.agencyId, this.props.match.params.staffId);
      this.props.keyworkerDispatch(keyworker);
      this.props.keyworkerAllocationsDispatch(allocations);
    } catch (error) {
      this.props.displayError(error);
    }
  }

  async getKeyworkerAllocations (agencyId, staffId) {
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

  async getKeyworkerDetails (staffId) {
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

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfile {...this.props} />;
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  path: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
    keyworker: state.keyworkerSearch.keyworker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
    keyworkerDispatch: id => dispatch(setKeyworker(id))
  };
};

export { KeyworkerProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileContainer));

