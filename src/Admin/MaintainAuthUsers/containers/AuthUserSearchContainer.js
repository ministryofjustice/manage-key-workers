import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import { connect } from 'react-redux'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import { resetError, setLoaded } from '../../../redux/actions/index'
import AuthUserSearch from '../components/AuthUserSearch'
import Page from '../../../Components/Page'

class AuthUserSearchContainer extends Component {
  constructor(props) {
    super(props)
    props.resetErrorDispatch()
    this.handleChange = this.handleChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  async componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
  }

  handleSearch(event) {
    const { history } = this.props
    const userQuery = qs.stringify(this.state)

    event.preventDefault()
    history.push({ pathname: '/admin-utilities/maintain-auth-users/search-results', search: userQuery })
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  render() {
    const {
      location: { search: user },
    } = this.props

    return (
      <Page title="Search for auth user" alwaysRender>
        <AuthUserSearch handleSearch={this.handleSearch} handleChange={this.handleChange} user={user} />
      </Page>
    )
  }
}

AuthUserSearchContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(AuthUserSearchContainer)
)
