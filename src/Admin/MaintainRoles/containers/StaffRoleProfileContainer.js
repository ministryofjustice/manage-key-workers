import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  resetError,
  setMaintainRolesRoleList,
  setMaintainRolesRoleFilter,
  setMessage,
  setMaintainRolesUserContextUser,
  setLoaded
} from '../../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../../Error';

import { StaffRoleProfile } from "../components/StaffRoleProfile";
import axios from "axios";
import { withRouter } from 'react-router';
import Spinner from "../../../Spinner";

class StaffRoleProfileContainer extends Component {
  constructor (props) {
    super();
    props.resetErrorDispatch();
    this.handleRemove = this.handleRemove.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  async componentDidMount () {
    this.props.setLoadedDispatch(false);
    await this.loadUser(this.props.match.params.username);
    await this.getUserRoles(this.props.match.params.username);
    this.props.setLoadedDispatch(true);
  }

  async handleRemove (event) {
    try {
      await axios.get('/api/removeRole', {
        params: {
          username: this.props.contextUser.username,
          agencyId: this.props.agencyId,
          roleCode: event.target.value
        }
      });
      await this.getUserRoles(this.props.contextUser.username);
      this.props.setMessageDispatch('Role list updated');
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

  handleAdd (event, history) {
    this.props.setRoleFilterDispatch('');
    history.push(`/maintainRoles/${this.props.contextUser.username}/addRole`);
  }

  async getUserRoles (username) {
    try {
      const roles = await axios.get('/api/contextUserRoles', {
        params: {
          username: username,
          hasAdminRole: this.props.user.maintainAccessAdmin
        }
      });
      this.props.setRoleListDispatch(roles.data);
    } catch (error) {
      this.props.handleError(error);
    }
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    if (this.props.loaded) {
      return (<StaffRoleProfile handleRemove={this.handleRemove}
        handleAdd={this.handleAdd}
        {...this.props}/>);
    }
    return <Spinner />;
  }
}

StaffRoleProfileContainer.propTypes = {
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  roleListDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  setRoleListDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  contextUser: PropTypes.object.isRequired,
  roleList: PropTypes.array.isRequired,
  setMessageDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    contextUser: state.maintainRoles.contextUser,
    roleList: state.maintainRoles.roleList,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetErrorDispatch: () => dispatch(resetError()),
    setRoleListDispatch: (list) => dispatch(setMaintainRolesRoleList(list)),
    setRoleFilterDispatch: (list) => dispatch(setMaintainRolesRoleFilter(list)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    contextUserDispatch: user => dispatch(setMaintainRolesUserContextUser(user)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { StaffRoleProfileContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StaffRoleProfileContainer));

