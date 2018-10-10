import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  resetError,
  setMaintainRolesRoleFilter,
  setMessage,
  setMaintainRolesUserContextUser,
  setMaintainRolesRoleFilterList,
  setMaintainRolesRoleList, setValidationError, resetValidationErrors, setLoaded
} from '../../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../../Error';

import axios from "axios";
import { withRouter } from 'react-router';
import { AddRole } from "../components/AddRole";
import { isBlank } from "../../../stringUtils";
import Spinner from "../../../Spinner";

class AddRoleContainer extends Component {
  constructor (props) {
    super();
    props.resetErrorDispatch();
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleRoleFilterChange = this.handleRoleFilterChange.bind(this);
    props.resetValidationErrorsDispatch();
  }

  async componentDidMount () {
    this.props.setLoadedDispatch(false);
    await this.loadUser(this.props.match.params.username);
    await this.getRoles();
    this.props.setLoadedDispatch(true);
  }

  handleRoleFilterChange (event) {
    this.props.setRoleFilterDispatch(event.target.value);
  }

  handleCancel (e, history) {
    e.preventDefault();
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack();
  }

  async getRoles () {
    try {
      const roles = await axios.get('/api/getRoles');
      this.props.roleFilterListDispatch(roles.data);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  async handleAdd (event, history) {
    if (!this.validate()) {
      return;
    }
    try {
      await axios.get('/api/addRole', {
        params: {
          username: this.props.contextUser.username,
          agencyId: this.props.agencyId,
          roleCode: this.props.roleFilter
        }
      });
      // await this.getUserRoles();
      this.props.setMessageDispatch('Role list updated');
      history.goBack();
    } catch (error) {
      this.props.handleError(error);
    }
  }

  async loadUser (username) {
    try {
      const user = await axios.get('/api/getUser', {
        params: {
          username: username
        }
      });
      this.props.contextUserDispatch(user.data);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  validate () {
    this.props.resetValidationErrorsDispatch();
    if (isBlank(this.props.roleFilter)) {
      this.props.setValidationErrorDispatch("role-select", "Please select a role");
      return false;
    }
    return true;
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<AddRole handleAdd={this.handleAdd} handleCancel={this.handleCancel} handleRoleFilterChange={this.handleRoleFilterChange} {...this.props}/>);
    }
    return <Spinner />;
  }
}

AddRoleContainer.propTypes = {
  error: PropTypes.string,
  roleFilter: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  roleFilterDispatch: PropTypes.func,
  roleFilterList: PropTypes.array,
  roleList: PropTypes.array,
  resetErrorDispatch: PropTypes.func,
  setRoleFilterDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  contextUser: PropTypes.object.isRequired,
  setMessageDispatch: PropTypes.func,
  resetValidationErrorsDispatch: PropTypes.func,
  setValidationErrorDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    contextUser: state.maintainRoles.contextUser,
    roleFilterList: state.maintainRoles.roleFilterList,
    roleList: state.maintainRoles.roleList,
    roleFilter: state.maintainRoles.roleFilter,
    validationErrors: state.app.validationErrors,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetErrorDispatch: () => dispatch(resetError()),
    setRoleFilterDispatch: (filter) => dispatch(setMaintainRolesRoleFilter(filter)),
    roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
    roleListDispatch: list => dispatch(setMaintainRolesRoleList(list)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    contextUserDispatch: user => dispatch(setMaintainRolesUserContextUser(user)),
    setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
    resetValidationErrorsDispatch: () => dispatch(resetValidationErrors()),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { AddRoleContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddRoleContainer));

