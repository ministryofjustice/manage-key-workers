import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import axios from "axios";
import { withRouter } from 'react-router';
import Error from '../../../Error';
import {
  resetError,
  setMaintainRolesRoleFilter,
  setMessage,
  setMaintainRolesUserContextUser,
  setMaintainRolesRoleFilterList,
  setMaintainRolesRoleList, setValidationError, resetValidationErrors, setLoaded
} from '../../../redux/actions/index';
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
    const { setLoadedDispatch, match } = this.props;

    setLoadedDispatch(false);
    await this.loadUser(match.params.username);
    await this.getRoles();
    setLoadedDispatch(true);
  }

  async getRoles () {
    const { roleFilterListDispatch, handleError, user } = this.props;

    try {
      const roles = await axios.get('/api/getRoles', {
        params: {
          hasAdminRole: user.maintainAccessAdmin
        }
      });
      roleFilterListDispatch(roles.data);
    } catch (error) {
      handleError(error);
    }
  }

  handleRoleFilterChange (event) {
    const { setRoleFilterDispatch } = this.props;

    setRoleFilterDispatch(event.target.value);
  }

  handleCancel (e, history) {
    e.preventDefault();
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack();
  }

  async handleAdd (event, history) {
    const { contextUser, agencyId, roleFilter, setMessageDispatch, handleError } = this.props;

    if (!this.validate()) return;

    try {
      await axios.get('/api/addRole', {
        params: {
          username: contextUser.username,
          agencyId,
          roleCode: roleFilter
        }
      });
      // await this.getUserRoles();
      setMessageDispatch('Role successfully added');
      history.goBack();
    } catch (error) {
      handleError(error);
    }
  }

  async loadUser (username) {
    const { contextUserDispatch, handleError} = this.props;
 
    try {
      const user = await axios.get('/api/getUser', {
        params: {
          username: username
        }
      });
      contextUserDispatch(user.data);
    } catch (error) {
      handleError(error);
    }
  }

  validate () {
    const { resetValidationErrorsDispatch, setValidationErrorDispatch, roleFilter } = this.props;

    resetValidationErrorsDispatch();
    if (isBlank(roleFilter)) {
      setValidationErrorDispatch("role-select", "Please select a role");
      return false;
    }
    return true;
  }

  render() {
    const { error, loaded } = this.props;

    if (error) return <Error {...this.props} />;

    if (loaded)
      return (
        <AddRole
          handleAdd={this.handleAdd}
          handleCancel={this.handleCancel}
          handleRoleFilterChange={this.handleRoleFilterChange}
          {...this.props}
        />
      );
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

