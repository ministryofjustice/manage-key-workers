/* eslint-disable radix */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios/index'
import qs from 'query-string'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import { setError, resetError, setLoaded, setMaintainAuthUsersList } from '../../../redux/actions/index'
import { authUserListType, errorType } from '../../../types'
import Page from '../../../Components/Page'
import AuthUserSearchResults from '../components/AuthUserSearchResults'
import validateSearch from './AuthUserSearchValidation'

class AuthUserSearchResultsContainer extends Component {
  constructor(props) {
    super()
    this.handleSearch = this.handleSearch.bind(this)
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

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  async performSearch() {
    const {
      location: { search },
      userListDispatch,
      setLoadedDispatch,
      resetErrorDispatch,
      handleError,
    } = this.props

    const { user } = qs.parse(search)
    if (!validateSearch(user, handleError)) {
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
      handleError(error)
    }

    setLoadedDispatch(true)
  }

  async handleSearch(event) {
    const { history } = this.props
    const userQuery = qs.stringify(this.state)

    event.preventDefault()
    history.push({ pathname: '/admin-utilities/maintain-auth-users/search-results', search: userQuery })
  }

  render() {
    const {
      location: { search },
      userList,
      error,
    } = this.props
    const { user } = qs.parse(search)
    return (
      <Page title="Search for auth user results" alwaysRender>
        <AuthUserSearchResults
          handleChange={this.handleChange}
          handleSearch={this.handleSearch}
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
  setLoadedDispatch: PropTypes.func.isRequired,
  userListDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  userList: authUserListType.isRequired,
  error: errorType.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  config: state.app.config,
  userList: state.maintainAuthUsers.userList,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  userListDispatch: list => dispatch(setMaintainAuthUsersList(list)),
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthUserSearchResultsContainer)
)
