/* eslint-disable radix */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  setMaintainRolesNameFilter,
  setMaintainRolesRoleFilterList,
  setMaintainRolesRoleFilter,
  setMaintainRolesUserList,
  setMaintainRolesUserTotalRecords,
  resetError,
  setLoaded, setMaintainRolesUserPageNumber
} from '../../../redux/actions/index';
import { connect } from 'react-redux';
import Error from '../../../Error';
import UserSearchResults from "../components/UserSearchResults";
import axios from "axios/index";
import Spinner from "../../../Spinner";

class UserSearchContainer extends Component {
  constructor (props) {
    super();
    this.handleRoleFilterChange = this.handleRoleFilterChange.bind(this);
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handlePageAction = this.handlePageAction.bind(this);
    props.resetErrorDispatch();
  }

  async componentDidMount () {
    const { setLoadedDispatch, pageNumber } = this.props;

    setLoadedDispatch(false);
    await this.getRoles();
    await this.performSearch(pageNumber);
    setLoadedDispatch(true);
  }

  async getRoles () {
    const { roleFilterListDispatch, setErrorDispatch, user } = this.props;

    try {
      const roles = await axios.get('/api/getRoles', {
        params: {
          hasAdminRole: user.maintainAccessAdmin
        }
      });
      roleFilterListDispatch(roles.data);
    } catch (error) {
      setErrorDispatch(error.message);
    }
  }

  async performSearch (page) {
    const {
      nameFilter,
      roleFilter,
      agencyId,
      pageSize,
      totalRecordsDispatch,
      userListDispatch,
      pageNumberDispatch,
      handleError,
      pageNumber,
      user,
    } = this.props;

    try {
      const pageNum = page === undefined ? pageNumber : page;
      const users = await axios.get('/api/userSearch', {
        params: {
          nameFilter,
          roleFilter,
          agencyId,
          hasAdminRole: user.maintainAccessAdmin
        },
        headers: {
          'Page-Offset': pageSize * pageNum,
          'Page-Limit': pageSize
        }
      });
      totalRecordsDispatch(parseInt(users.headers['total-records']));
      userListDispatch(users.data);
      pageNumberDispatch(pageNumber);
    } catch (error) {
      handleError(error);
    }
  }

  handleRoleFilterChange (event) {
    const { pageNumberDispatch, roleFilterDispatch } = this.props;

    pageNumberDispatch(0);
    roleFilterDispatch(event.target.value);
  }

  handleNameFilterChange (event) {
    const { pageNumberDispatch, nameFilterDispatch } = this.props;

    pageNumberDispatch(0);
    nameFilterDispatch(event.target.value);
  }

  async handleSearch (history) {
    const { setLoadedDispatch } = this.props;

    setLoadedDispatch(false);
    await this.performSearch();
    setLoadedDispatch(true);
  }

  async handlePageAction (pageNumber) {
    await this.performSearch(pageNumber);
  }

  async handleEdit (event, history) {
    const { userList } = this.props;
    const chosenUser = userList[event.target.value];
    history.push(`/maintainRoles/${chosenUser.username}/profile`);
  }

  render() {
    const { error, loaded } = this.props;

    if (error) return <Error {...this.props} />;

    if (loaded)
      return (
        <UserSearchResults
          handleRoleFilterChange={this.handleRoleFilterChange}
          handleNameFilterChange={this.handleNameFilterChange}
          handlePageAction={this.handlePageAction}
          handleSearch={this.handleSearch}
          handleEdit={this.handleEdit}
          {...this.props}
        />
      );

    return <Spinner />;
  }
}

UserSearchContainer.propTypes = {
  nameFilter: PropTypes.string,
  roleFilter: PropTypes.string,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  totalRecords: PropTypes.number,
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func,
  roleFilterDispatch: PropTypes.func,
  totalRecordsDispatch: PropTypes.func,
  pageNumberDispatch: PropTypes.func,
  roleFilterListDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func,
  config: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    nameFilter: state.maintainRoles.nameFilter,
    roleFilter: state.maintainRoles.roleFilter,
    agencyId: state.app.user.activeCaseLoadId,
    roleFilterList: state.maintainRoles.roleFilterList,
    userList: state.maintainRoles.userList,
    pageNumber: state.maintainRoles.pageNumber,
    pageSize: state.maintainRoles.pageSize,
    totalRecords: state.maintainRoles.totalRecords,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    nameFilterDispatch: text => dispatch(setMaintainRolesNameFilter(text)),
    roleFilterDispatch: text => dispatch(setMaintainRolesRoleFilter(text)),
    roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
    userListDispatch: list => dispatch(setMaintainRolesUserList(list)),
    pageNumberDispatch: no => dispatch(setMaintainRolesUserPageNumber(no)),
    totalRecordsDispatch: no => dispatch(setMaintainRolesUserTotalRecords(no)),
    resetErrorDispatch: () => dispatch(resetError()),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSearchContainer);

