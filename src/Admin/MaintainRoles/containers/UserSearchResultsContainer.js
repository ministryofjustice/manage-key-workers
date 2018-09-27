/* eslint-disable radix */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  setMaintainRolesNameFilter,
  setMaintainRolesRoleList,
  setMaintainRolesRoleFilter,
  setMaintainRolesUserList,
  setMaintainRolesUserTotalRecords,
  resetError,
  setError,
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
    this.props.setLoadedDispatch(false);
    await this.getRoles();
    await this.performSearch(this.props.pageNumber);
    this.props.setLoadedDispatch(true);
  }

  async getRoles () {
    try {
      const roles = await axios.get('/api/getRoles');
      this.props.roleListDispatch(roles.data);
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  async performSearch (page) {
    try {
      const pageNumber = page ? page : this.props.pageNumber;
      const users = await axios.get('/api/userSearch', {
        params: {
          nameFilter: this.props.nameFilter,
          roleFilter: this.props.roleFilter,
          agencyId: this.props.agencyId
        },
        headers: {
          'Page-Offset': this.props.pageSize * pageNumber,
          'Page-Limit': this.props.pageSize
        }
      });
      console.log(`page number ${this.props.pageNumber}`);
      console.log(`page size ${this.props.pageSize}`);
      this.props.totalRecordsDispatch(parseInt(users.headers['total-records']));
      this.props.userListDispatch(users.data);
      this.props.pageNumberDispatch(pageNumber);
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  handleRoleFilterChange (event) {
    this.props.pageNumberDispatch(0);
    this.props.roleFilterDispatch(event.target.value);
  }

  handleNameFilterChange (event) {
    this.props.pageNumberDispatch(0);
    this.props.nameFilterDispatch(event.target.value);
  }

  async handleSearch (history) {
    await this.performSearch();
  }

  async handlePageAction (pageNumber) {
    console.log(`handle page action ${pageNumber}`);
    await this.performSearch(pageNumber);
  }

  async handleEdit (event, history) {
    //stash identifier
    history.push('/maintainRoles/profile');
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<UserSearchResults
        handleRoleFilterChange={this.handleRoleFilterChange}
        handleNameFilterChange={this.handleNameFilterChange}
        handlePageAction={this.handlePageAction}
        handleSearch={this.handleSearch}
        handleEdit={this.handleEdit}
        {...this.props}/>);
    }
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
  roleListDispatch: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  setErrorDispatch: PropTypes.func
};

const mapStateToProps = state => {
  return {
    nameFilter: state.maintainRoles.nameFilter,
    roleFilter: state.maintainRoles.roleFilter,
    agencyId: state.app.user.activeCaseLoadId,
    roleList: state.maintainRoles.roleList,
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
    roleListDispatch: list => dispatch(setMaintainRolesRoleList(list)),
    userListDispatch: list => dispatch(setMaintainRolesUserList(list)),
    pageNumberDispatch: no => dispatch(setMaintainRolesUserPageNumber(no)),
    totalRecordsDispatch: no => dispatch(setMaintainRolesUserTotalRecords(no)),
    resetErrorDispatch: () => dispatch(resetError()),
    setLoadedDispatch: (status) => dispatch(setLoaded(status)),
    setErrorDispatch: () => dispatch(setError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSearchContainer);

