import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import axios from 'axios'
import { withRouter } from 'react-router'
import {
  setError,
  resetError,
  setMaintainRolesRoleAdd,
  setMessage,
  setMaintainRolesUserContextUser,
  setMaintainRolesRoleFilterList,
  setValidationError,
  resetValidationErrors,
  setLoaded,
} from '../../../redux/actions/index'
import { AddRole } from '../components/AddRole'
import { isBlank, properCaseName } from '../../../stringUtils'
import { roleFilterListType, roleListType, userType, contextUserType, routeMatchType } from '../../../types'
import Page from '../../../Components/Page'

class AddRoleContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleRoleAddChange = this.handleRoleAddChange.bind(this)
    props.resetValidationErrorsDispatch()
  }

  async componentDidMount() {
    const { setLoadedDispatch, match } = this.props

    setLoadedDispatch(false)
    await this.loadUser(match.params.username)
    await this.getRoles()
    setLoadedDispatch(true)
  }

  async getRoles() {
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

  handleRoleAddChange = event => {
    const { setRoleAddDispatch } = this.props

    setRoleAddDispatch(event.target.value)
  }

  handleCancel = (e, history) => {
    e.preventDefault()
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack()
  }

  async handleAdd(event, history) {
    const { contextUser, agencyId, roleAdd, setMessageDispatch, handleError } = this.props

    if (!this.validate()) return

    try {
      await axios.get('/api/addRole', {
        params: {
          username: contextUser.username,
          agencyId,
          roleCode: roleAdd,
        },
      })
      // await this.getUserRoles();
      setMessageDispatch('Role successfully added')
      history.goBack()
    } catch (error) {
      handleError(error)
    }
  }

  async loadUser(username) {
    const { contextUserDispatch, handleError } = this.props

    try {
      const user = await axios.get('/api/getUser', {
        params: {
          username,
        },
      })
      contextUserDispatch(user.data)
    } catch (error) {
      handleError(error)
    }
  }

  validate() {
    const { resetValidationErrorsDispatch, setValidationErrorDispatch, roleAdd } = this.props

    resetValidationErrorsDispatch()
    if (isBlank(roleAdd)) {
      setValidationErrorDispatch('role-select', 'Please select a role')
      return false
    }
    return true
  }

  render() {
    const { contextUser } = this.props
    const formattedName =
      contextUser && `${properCaseName(contextUser.firstName)} ${properCaseName(contextUser.lastName)}`

    return (
      <Page title={`Add staff role: ${formattedName}`}>
        <AddRole
          handleAdd={this.handleAdd}
          handleCancel={this.handleCancel}
          handleRoleAddChange={this.handleRoleAddChange}
          {...this.props}
        />
      </Page>
    )
  }
}

AddRoleContainer.propTypes = {
  error: PropTypes.string.isRequired,
  user: userType.isRequired,
  roleAdd: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  roleFilterList: roleFilterListType.isRequired,
  roleList: roleListType.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setRoleAddDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  roleFilterListDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  contextUserDispatch: PropTypes.func.isRequired,
  contextUser: contextUserType.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  resetValidationErrorsDispatch: PropTypes.func.isRequired,
  setValidationErrorDispatch: PropTypes.func.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
  match: routeMatchType.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
  contextUser: state.maintainRoles.contextUser,
  roleFilterList: state.maintainRoles.roleFilterList,
  roleList: state.maintainRoles.roleList,
  roleAdd: state.maintainRoles.roleAdd,
  validationErrors: state.app.validationErrors,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setRoleAddDispatch: filter => dispatch(setMaintainRolesRoleAdd(filter)),
  roleFilterListDispatch: list => dispatch(setMaintainRolesRoleFilterList(list)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  contextUserDispatch: user => dispatch(setMaintainRolesUserContextUser(user)),
  setValidationErrorDispatch: (fieldName, message) => dispatch(setValidationError(fieldName, message)),
  resetValidationErrorsDispatch: () => dispatch(resetValidationErrors()),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { AddRoleContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddRoleContainer))
