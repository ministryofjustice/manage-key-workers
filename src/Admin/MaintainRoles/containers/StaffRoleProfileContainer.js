import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { resetError, setError } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../../Error';

import { StaffRoleProfile } from "../components/StaffRoleProfile";
// import axios from "axios/index";

class StaffRoleProfileContainer extends Component {
  constructor (props) {
    super();
    props.resetErrorDispatch();
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    return (<StaffRoleProfile
      {...this.props}/>);
  }
}

StaffRoleProfileContainer.propTypes = {
  nameFilter: PropTypes.string,
  roleFilter: PropTypes.string,
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func,
  roleFilterDispatch: PropTypes.func,
  roleListDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetErrorDispatch: () => dispatch(resetError()),
    setErrorDispatch: () => dispatch(setError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffRoleProfileContainer);

