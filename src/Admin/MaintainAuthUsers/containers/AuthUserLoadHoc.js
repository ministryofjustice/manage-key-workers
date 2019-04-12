import React, { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import axios from 'axios'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { setLoaded, setMaintainAuthContextUser, setMaintainAuthRoleList } from '../../../redux/actions'
import { routeMatchType } from '../../../types'

const loadComponent = WrappedComponent => {
  class AuthUserLoadHoc extends Component {
    async componentDidMount() {
      const { setLoadedDispatch, match } = this.props

      setLoadedDispatch(false)
      await this.loadUser(match.params.username)
      await this.getUserRoles(match.params.username)
      setLoadedDispatch(true)
    }

    async getUserRoles(username) {
      const { setRoleListDispatch, handleError } = this.props

      try {
        const roles = await axios.get('/api/auth-user-roles', {
          params: {
            username,
          },
        })
        setRoleListDispatch(roles.data)
      } catch (error) {
        handleError(error)
      }
    }

    async loadUser(username) {
      const { contextUserDispatch, handleError } = this.props

      try {
        const user = await axios.get('/api/auth-user-get', {
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
      return <WrappedComponent {...this.props} getUserRoles={this.getUserRoles} />
    }
  }

  AuthUserLoadHoc.propTypes = {
    match: routeMatchType.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    contextUserDispatch: PropTypes.func.isRequired,
    setLoadedDispatch: PropTypes.func.isRequired,
    setRoleListDispatch: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
  }

  return AuthUserLoadHoc
}

const mapDispatchToProps = dispatch => ({
  contextUserDispatch: user => dispatch(setMaintainAuthContextUser(user)),
  setRoleListDispatch: list => dispatch(setMaintainAuthRoleList(list)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  loadComponent
)
