/* eslint-disable radix */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios/index'
import {
  setMaintainRolesNameFilter,
  setMaintainRolesRoleFilterList,
  setMaintainRolesRoleFilter,
  setMaintainRolesUserList,
  setMaintainRolesUserTotalRecords,
  setError,
  resetError,
  setLoaded,
  setMaintainRolesUserPageNumber,
} from '../../../redux/actions/index'
import UserSearchResults from '../components/UserSearchResults'
import { userType, configType, userListType } from '../../../types'
import Page from '../../../Components/Page'

class UserSearchContainer extends Component {
  constructor(props) {
    super()
    this.handleRoleFilterChange = this.handleRoleFilterChange.bind(this)
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handlePageAction = this.handlePageAction.bind(this)
    props.resetErrorDispatch()
  }

  async componentDidMount() {
    const { setLoadedDispatch, pageNumber } = this.props

    setLoadedDispatch(false)
    await this.getRoles()
    await this.performSearch(pageNumber)
    setLoadedDispatch(true)
  }

  async getRoles() {
    const { roleFilterListDispatch, setErrorDispatch, user } = this.props

    try {
      const roles = await axios.get('/api/getRoles', {
        params: {
          hasAdminRole: user.maintainAccessAdmin,
        },
      })
      roleFilterListDispatch(roles.data)
    } catch (error) {
      setErrorDispatch(error.message)
    }
  }

  async performSearch(page) {
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
    } = this.props

    try {
      const pageNum = page === undefined ? pageNumber : page
      const users = await axios.get('/api/userSearch', {
        params: {
          nameFilter,
          roleFilter,
          agencyId,
          hasAdminRole: user.maintainAccessAdmin,
        },
        headers: {
          'Page-Offset': pageSize * pageNum,
          'Page-Limit': pageSize,
        },
      })
      totalRecordsDispatch(parseInt(users.headers['total-records']))
      userListDispatch(users.data)
      pageNumberDispatch(pageNum)
    } catch (error) {
      handleError(error)
    }
  }

  handleRoleFilterChange(event) {
    const { pageNumberDispatch, roleFilterDispatch } = this.props

    pageNumberDispatch(0)
    roleFilterDispatch(event.target.value)
  }

  handleNameFilterChange(event) {
    const { pageNumberDispatch, nameFilterDispatch } = this.props

    pageNumberDispatch(0)
    nameFilterDispatch(event.target.value)
  }

  async handleSearch() {
    const { setLoadedDispatch } = this.props

    setLoadedDispatch(false)
    await this.performSearch()
    setLoadedDispatch(true)
  }

  async handlePageAction(pageNumber) {
    await this.performSearch(pageNumber)
  }

  async handleEdit(event, history) {
    const { userList } = this.props
    const chosenUser = userList[event.target.value]
    history.push(`/admin-utilities/maintain-roles/${chosenUser.username}/roles`)
  }

  render() {
    return (
      <Page title="Search for staff member results">
        <UserSearchResults
          handleRoleFilterChange={this.handleRoleFilterChange}
          handleNameFilterChange={this.handleNameFilterChange}
          handlePageAction={this.handlePageAction}
          handleSearch={this.handleSearch}
          handleEdit={this.handleEdit}
          {...this.props}
        />
      </Page>
    )
  }
}

UserSearchContainer.propTypes = {
  nameFilter: PropTypes.string.isRequired,
  roleFilter: PropTypes.string.isRequired,
  pageNumber: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  error: PropTypes.string.isRequired,
  user: userType.isRequired,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func.isRequired,
  roleFilterDispatch: PropTypes.func.isRequired,
  totalRecordsDispatch: PropTypes.func.isRequired,
  pageNumberDispatch: PropTypes.func.isRequired,
  roleFilterListDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  config: configType.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  userListDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  userList: userListType.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  config: state.app.config,
  nameFilter: state.maintainRoles.nameFilter,
  roleFilter: state.maintainRoles.roleFilter,
  agencyId: state.app.user.activeCaseLoadId,
  roleFilterList: state.maintainRoles.roleFilterList,
  userList: state.maintainRoles.userList,
  pageNumber: state.maintainRoles.pageNumber,
  pageSize: state.maintainRoles.pageSize,
  totalRecords: state.maintainRoles.totalRecords,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  nameFilterDispatch: text => dispatch(setMaintainRolesNameFilter(text)),
  roleFilterDispatch: text => dispatch(setMaintainRolesRoleFilter(text)),
  roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
  userListDispatch: list => dispatch(setMaintainRolesUserList(list)),
  pageNumberDispatch: no => dispatch(setMaintainRolesUserPageNumber(no)),
  totalRecordsDispatch: no => dispatch(setMaintainRolesUserTotalRecords(no)),
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearchContainer)
