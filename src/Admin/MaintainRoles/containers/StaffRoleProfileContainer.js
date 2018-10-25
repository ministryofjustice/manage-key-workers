import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from 'react-router'
import {
  resetError,
  setMaintainRolesRoleList,
  setMaintainRolesRoleFilter,
  setMessage,
  setMaintainRolesUserContextUser,
  setLoaded,
} from '../../../redux/actions/index'
import Error from '../../../Error'

import { StaffRoleProfile } from '../components/StaffRoleProfile'
import Spinner from '../../../Spinner'

class StaffRoleProfileContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.handleRemove = this.handleRemove.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
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

  async handleRemove(event) {
    const { contextUser, agencyId, setMessageDispatch, handleError } = this.props

    try {
      await axios.get('/api/removeRole', {
        params: {
          username: contextUser.username,
          agencyId,
          roleCode: event.target.value,
        },
      })
      await this.getUserRoles(contextUser.username)
      setMessageDispatch('Role list updated')
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

  handleAdd(event, history) {
    const { setRoleFilterDispatch, contextUser } = this.props

    setRoleFilterDispatch('')
    history.push(`/maintainRoles/${contextUser.username}/addRole`)
  }

  render() {
    const { error, loaded } = this.props

    if (error) return <Error {...this.props} />

    if (loaded) return <StaffRoleProfile handleRemove={this.handleRemove} handleAdd={this.handleAdd} {...this.props} />

    return <Spinner />
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
  setMessageDispatch: PropTypes.func,
}

const mapStateToProps = state => ({
  agencyId: state.app.user.activeCaseLoadId,
  contextUser: state.maintainRoles.contextUser,
  roleList: state.maintainRoles.roleList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
  setRoleListDispatch: list => dispatch(setMaintainRolesRoleList(list)),
  setRoleFilterDispatch: list => dispatch(setMaintainRolesRoleFilter(list)),
  setMessageDispatch: message => dispatch(setMessage(message)),
  contextUserDispatch: user => dispatch(setMaintainRolesUserContextUser(user)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { StaffRoleProfileContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StaffRoleProfileContainer))
