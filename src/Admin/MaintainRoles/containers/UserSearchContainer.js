import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setMaintainRolesNameFilter, setMaintainRolesRoleList, setMaintainRolesRoleFilter, setMaintainRolesUserPageNumber, resetError, setError } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../../Error';

import UserSearch from "../components/UserSearch";
import axios from "axios/index";

class UserSearchContainer extends Component {
  constructor (props) {
    super();
    this.handleRoleFilterChange = this.handleRoleFilterChange.bind(this);
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    props.resetErrorDispatch();
    props.nameFilterDispatch('');
    props.roleFilterDispatch('');
    props.pageNumberDispatch(0);
  }

  async componentDidMount () {
    await this.getRoles();
  }

  async getRoles () {
    try {
      const roles = await axios.get('/api/getRoles');
      this.props.roleListDispatch(roles.data);
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  handleRoleFilterChange (event) {
    this.props.roleFilterDispatch(event.target.value);
  }

  handleNameFilterChange (event) {
    this.props.nameFilterDispatch(event.target.value);
  }

  handleSearch (history) {
    history.push('/maintainRoles/results');
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    return (<UserSearch
      handleRoleFilterChange={this.handleRoleFilterChange}
      handleNameFilterChange={this.handleNameFilterChange}
      handleSearch={this.handleSearch}
      {...this.props}/>);
  }
}

UserSearchContainer.propTypes = {
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
    nameFilter: state.maintainRoles.nameFilter,
    roleFilter: state.maintainRoles.roleFilter,
    agencyId: state.app.user.activeCaseLoadId,
    roleList: state.maintainRoles.roleList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    nameFilterDispatch: text => dispatch(setMaintainRolesNameFilter(text)),
    roleFilterDispatch: text => dispatch(setMaintainRolesRoleFilter(text)),
    roleListDispatch: list => dispatch(setMaintainRolesRoleList(list)),
    pageNumberDispatch: list => dispatch(setMaintainRolesUserPageNumber(list)),
    resetErrorDispatch: () => dispatch(resetError()),
    setErrorDispatch: () => dispatch(setError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSearchContainer);

