import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setMaintainRolesNameFilter, setMaintainRolesRoleFilterList, setMaintainRolesRoleFilter, setMaintainRolesUserPageNumber, resetError } from '../../../redux/actions/index';
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
      const roles = await axios.get('/api/getRoles', {
        params: {
          hasAdminRole: this.props.user.maintainAccessAdmin
        }
      });
      this.props.roleFilterListDispatch(roles.data);
    } catch (error) {
      this.props.handleError(error);
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
  roleFilterListDispatch: PropTypes.func,
  pageNumberDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    nameFilter: state.maintainRoles.nameFilter,
    roleFilter: state.maintainRoles.roleFilter,
    agencyId: state.app.user.activeCaseLoadId,
    roleFilterList: state.maintainRoles.roleFilterList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    nameFilterDispatch: text => dispatch(setMaintainRolesNameFilter(text)),
    roleFilterDispatch: text => dispatch(setMaintainRolesRoleFilter(text)),
    roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
    pageNumberDispatch: list => dispatch(setMaintainRolesUserPageNumber(list)),
    resetErrorDispatch: () => dispatch(resetError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSearchContainer);

