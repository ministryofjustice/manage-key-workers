/* eslint-disable radix */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios/index'
import qs from 'query-string'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import { handleAxiosError, resetError, setError, setLoaded } from '../../../redux/actions/index'
import { authUserListType, errorType } from '../../../types'
import Page from '../../../Components/Page'
import AuthUserSearchResults from '../components/AuthUserSearchResults'
import validateSearch from './AuthUserSearchValidation'
import searchComponent from './AuthUserSearchHoc'
import { setMaintainAuthUsersList } from '../../../redux/actions/maintainAuthUserActions'

class AuthUserSearchResultsContainer extends Component {
  constructor(props) {
    super()
    this.handleEdit = this.handleEdit.bind(this)
    props.resetErrorDispatch()
  }

  async componentDidMount() {
    await this.performSearch()
  }

  async componentDidUpdate(prevProps) {
    const { location } = this.props

    if (prevProps.location.search !== location.search) {
      await this.performSearch()
    }
  }

  async performSearch() {
    const {
      location: { search },
      userListDispatch,
      setLoadedDispatch,
      resetErrorDispatch,
      setErrorDispatch,
      handleAxiosErrorDispatch,
    } = this.props

    const { user } = qs.parse(search)
    if (!validateSearch(user, setErrorDispatch)) {
      userListDispatch([])
      return
    }

    setLoadedDispatch(false)
    try {
      const users = await axios.get('/api/auth-user-search', {
        params: {
          nameFilter: user,
        },
      })
      userListDispatch(users.data)
      resetErrorDispatch()
    } catch (error) {
      userListDispatch([])
      handleAxiosErrorDispatch(error)
    }

    setLoadedDispatch(true)
  }

  handleEdit(event) {
    const { userList, history } = this.props
    const chosenUser = userList[event.target.value]

    event.preventDefault()
    history.push(`/admin-utilities/maintain-auth-users/${chosenUser.username}`)
  }

  render() {
    const {
      location: { search },
      userList,
      error,
      handleSearch,
      handleChange,
    } = this.props
    const { user } = qs.parse(search)
    return (
      <Page title="Search for auth user results" alwaysRender>
        <AuthUserSearchResults
          handleChange={handleChange}
          handleSearch={handleSearch}
          handleEdit={this.handleEdit}
          user={user}
          userList={userList}
          error={error}
        />
      </Page>
    )
  }
}

AuthUserSearchResultsContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  userListDispatch: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  userList: authUserListType.isRequired,
  error: errorType.isRequired,
  handleAxiosErrorDispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  config: state.app.config,
  userList: state.maintainAuthUsers.userList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  userListDispatch: list => dispatch(setMaintainAuthUsersList(list)),
  resetErrorDispatch: () => dispatch(resetError()),
  setErrorDispatch: error => dispatch(setError(error)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  handleAxiosErrorDispatch: error => dispatch(handleAxiosError(error)),
})

export default withRouter(
  searchComponent(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AuthUserSearchResultsContainer)
  )
)
