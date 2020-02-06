import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router'
import {
  setError,
  resetError,
  setMaintainRolesRoleList,
  setMaintainRolesRoleFilter,
  setMaintainRolesUserContextUser,
  setLoaded,
} from '../../../redux/actions/index'
import { StaffRoleProfile } from '../components/StaffRoleProfile'
import { userType, contextUserType, roleListType, routeMatchType } from '../../../types'
import { properCaseName } from '../../../stringUtils'
import Page from '../../../Components/Page'

class StaffRoleProfileContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
  }

  async componentDidMount() {
    const { setLoadedDispatch, match } = this.props

    setLoadedDispatch(false)
    await this.loadUser(match.params.username)
    await this.getUserRoles(match.params.username)
    setLoadedDispatch(true)
  }

  async getUserRoles(username) {
    const { setRoleListDispatch, handleError, user, agencyId } = this.props

    try {
      const roles = await axios.get('/api/contextUserRoles', {
        params: {
          username,
          agencyId,
          hasAdminRole: user.maintainAccessAdmin,
        },
      })
      setRoleListDispatch(roles.data)
    } catch (error) {
      handleError(error)
    }
  }

  handleRemove = async event => {
    const { contextUser, agencyId, handleError } = this.props

    try {
      await axios.get('/api/removeRole', {
        params: {
          username: contextUser.username,
          agencyId,
          roleCode: event.target.value,
        },
      })
      await this.getUserRoles(contextUser.username)
    } catch (error) {
      handleError(error)
    }
  }

  handleAdd = (event, history) => {
    const { setRoleFilterDispatch, contextUser } = this.props

    setRoleFilterDispatch('')
    history.push(`/admin-utilities/maintain-roles/${contextUser.username}/roles/add-role`)
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

  render() {
    const { contextUser } = this.props
    const formattedName =
      contextUser && `${properCaseName(contextUser.firstName)} ${properCaseName(contextUser.lastName)}`

    return (
      <Page title={`Staff roles: ${formattedName}`}>
        <StaffRoleProfile handleRemove={this.handleRemove} handleAdd={this.handleAdd} {...this.props} />
      </Page>
    )
  }
}

StaffRoleProfileContainer.propTypes = {
  error: PropTypes.string.isRequired,
  user: userType.isRequired,
  agencyId: PropTypes.string.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setRoleListDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  contextUser: contextUserType.isRequired,
  roleList: roleListType.isRequired,
  message: PropTypes.string.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  match: routeMatchType.isRequired,
  handleError: PropTypes.func.isRequired,
  contextUserDispatch: PropTypes.func.isRequired,
  setRoleFilterDispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
  contextUser: state.maintainRoles.contextUser,
  roleList: state.maintainRoles.roleList,
  loaded: state.app.loaded,
  message: state.app.message,
})

const mapDispatchToProps = dispatch => ({
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setRoleListDispatch: list => dispatch(setMaintainRolesRoleList(list)),
  setRoleFilterDispatch: list => dispatch(setMaintainRolesRoleFilter(list)),
  contextUserDispatch: user => dispatch(setMaintainRolesUserContextUser(user)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { StaffRoleProfileContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StaffRoleProfileContainer))
