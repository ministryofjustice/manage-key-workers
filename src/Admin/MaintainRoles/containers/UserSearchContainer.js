import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios/index'
import {
  setMaintainRolesNameFilter,
  setMaintainRolesRoleFilterList,
  setMaintainRolesRoleFilter,
  setMaintainRolesUserPageNumber,
  resetError,
  setLoaded,
} from '../../../redux/actions/index'
import UserSearch from '../components/UserSearch'
import { userType } from '../../../types'
import Page from '../../../Components/Page'

class UserSearchContainer extends Component {
  constructor(props) {
    super(props)
    props.resetErrorDispatch()
    props.nameFilterDispatch('')
    props.roleFilterDispatch('')
    props.pageNumberDispatch(0)
  }

  async componentDidMount() {
    const { dispatchLoaded } = this.props
    await this.getRoles()
    dispatchLoaded(true)
  }

  getRoles = async () => {
    const { roleFilterListDispatch, handleError, user } = this.props

    try {
      const roles = await axios.get('/api/getRoles', {
        params: {
          hasAdminRole: user.maintainAccessAdmin,
        },
      })
      roleFilterListDispatch(roles.data)
    } catch (error) {
      handleError(error)
    }
  }

  handleRoleFilterChange = event => {
    const { roleFilterDispatch } = this.props

    roleFilterDispatch(event.target.value)
  }

  handleSearch = history => {
    history.push('/admin-utilities/maintain-roles/search-results')
  }

  handleNameFilterChange = event => {
    const { nameFilterDispatch } = this.props

    nameFilterDispatch(event.target.value)
  }

  render() {
    return (
      <Page title="Search for staff member">
        <UserSearch
          handleRoleFilterChange={this.handleRoleFilterChange}
          handleNameFilterChange={this.handleNameFilterChange}
          handleSearch={this.handleSearch}
          {...this.props}
        />
      </Page>
    )
  }
}

UserSearchContainer.propTypes = {
  nameFilter: PropTypes.string.isRequired,
  roleFilter: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  user: userType.isRequired,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func.isRequired,
  roleFilterDispatch: PropTypes.func.isRequired,
  roleFilterListDispatch: PropTypes.func.isRequired,
  pageNumberDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  nameFilter: state.maintainRoles.nameFilter,
  roleFilter: state.maintainRoles.roleFilter,
  agencyId: state.app.user.activeCaseLoadId,
  roleFilterList: state.maintainRoles.roleFilterList,
})

const mapDispatchToProps = dispatch => ({
  nameFilterDispatch: text => dispatch(setMaintainRolesNameFilter(text)),
  roleFilterDispatch: text => dispatch(setMaintainRolesRoleFilter(text)),
  roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
  pageNumberDispatch: list => dispatch(setMaintainRolesUserPageNumber(list)),
  resetErrorDispatch: () => dispatch(resetError()),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSearchContainer)
