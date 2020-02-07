import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactRouterPropTypes from 'react-router-prop-types'
import axios from 'axios'
import { withRouter } from 'react-router'

import { setError, resetError, setLoaded, handleAxiosError } from '../../../redux/actions/index'
import AuthUserAddGroup from '../components/AuthUserAddGroup'
import { routeMatchType, authGroupListType, contextAuthUserType, errorType } from '../../../types'
import Page from '../../../Components/Page'
import { loadAuthUserRolesAndGroups } from '../../../redux/actions/maintainAuthUserActions'
import { validateAddGroup } from './AuthUserValidation'

class AuthUserAddGroupContainer extends Component {
  constructor(props) {
    super()
    props.resetErrorDispatch()
    this.state = {}
  }

  async componentDidMount() {
    const { loadAuthUserRolesAndGroupsDispatch, match } = this.props

    this.getGroups()
    loadAuthUserRolesAndGroupsDispatch(match.params.username)
  }

  async getGroups() {
    const { handleAxiosErrorDispatch } = this.props

    try {
      const { data } = await axios.get('/api/auth-groups')
      this.setState(state => ({ ...state, groups: data }))
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState(state => ({ ...state, [name]: value }))
  }

  handleAdd = async event => {
    const { contextUser, handleAxiosErrorDispatch, setErrorDispatch, history } = this.props
    const { groups, group } = this.state

    event.preventDefault()

    const selectedGroup = groups.find(r => r.groupCode === group)

    const errors = validateAddGroup(selectedGroup)
    if (errors.length) {
      setErrorDispatch(errors)
      return
    }

    try {
      await axios.get('/api/auth-user-groups-add', {
        params: {
          username: contextUser.username,
          group: selectedGroup.groupCode,
        },
      })
      history.goBack()
    } catch (error) {
      handleAxiosErrorDispatch(error)
    }
  }

  handleCancel = e => {
    const { history } = this.props
    e.preventDefault()
    history.goBack()
  }

  render() {
    const {
      contextUser: { firstName, lastName },
    } = this.props
    const { groups } = this.state

    if ((!firstName && !lastName) || !groups) {
      return (
        <Page title="not found group:" alwaysRender>
          <div>User not found</div>
        </Page>
      )
    }

    return (
      <Page title={`Add group: ${firstName} ${lastName}`} alwaysRender>
        <AuthUserAddGroup
          handleAdd={this.handleAdd}
          handleCancel={this.handleCancel}
          handleGroupAddChange={this.handleChange}
          groupFilterList={groups}
          {...this.props}
        />
      </Page>
    )
  }
}

AuthUserAddGroupContainer.propTypes = {
  error: errorType.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  contextUser: contextAuthUserType,
  groupList: authGroupListType,
  match: routeMatchType.isRequired,
  loadAuthUserRolesAndGroupsDispatch: PropTypes.func.isRequired,
  handleAxiosErrorDispatch: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
}

AuthUserAddGroupContainer.defaultProps = {
  contextUser: {},
  groupList: [],
}

const mapStateToProps = state => ({
  error: state.app.error,
  contextUser: state.maintainAuthUsers.contextUser,
  groupList: state.maintainAuthUsers.groupList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  handleAxiosErrorDispatch: error => dispatch(handleAxiosError(error)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  loadAuthUserRolesAndGroupsDispatch: username => dispatch(loadAuthUserRolesAndGroups(username)),
})

export { AuthUserAddGroupContainer }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuthUserAddGroupContainer))
