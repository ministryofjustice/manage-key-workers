import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworkerAllocationList, setKeyworker, setError } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfile from '../components/KeyworkerProfile';
import { withRouter } from 'react-router';

import axiosWrapper from "../../backendWrapper";

class KeyworkerProfileContainer extends Component {
  constructor () {
    super();
    this.displayError = this.displayError.bind(this);
    this.getKeyworkerProfile = this.getKeyworkerProfile.bind(this);
  }

  componentWillMount () {
    this.getKeyworkerProfile(this.props.paramStaffId);
  }

  async getKeyworkerProfile () {
    try {
      const keyworker = await this.getKeyworkerDetails(this.props.agencyId, this.props.match.params.staffId);
      const allocations = await this.getKeyworkerAllocations(this.props.agencyId, this.props.match.params.staffId);
      this.props.keyworkerDispatch(keyworker);
      this.props.keyworkerAllocationsDispatch(allocations);
    } catch (error) {
      this.displayError(error);
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

  async getKeyworkerDetails (agencyId, staffId) {
    const response = await axiosWrapper.get('/keyworker', {
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

  displayError (error) {
    this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  render () {
    if (this.props.error) {
      return (<div className="error-summary">
        <div className="error-message">
          <div> {this.props.error.message || this.props.error} </div>
        </div>
      </div>);
    }

    return <KeyworkerProfile {...this.props} />;
  }
}

KeyworkerProfileContainer.propTypes = {
  error: PropTypes.string,
  paramStaffId: PropTypes.string,
  path: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setErrorDispatch: PropTypes.func,
  keyworkerAllocationsDispatch: PropTypes.func,
  keyworkerDispatch: PropTypes.func,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.app.error,
    agencyId: state.app.user.activeCaseLoadId,
    jwt: state.app.jwt,
    keyworkerAllocations: state.keyworkerSearch.keyworkerAllocations,
    keyworker: state.keyworkerSearch.keyworker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerAllocationsDispatch: list => dispatch(setKeyworkerAllocationList(list)),
    keyworkerDispatch: id => dispatch(setKeyworker(id)),
    setErrorDispatch: error => dispatch(setError(error))
  };
};

export { KeyworkerProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileContainer));

