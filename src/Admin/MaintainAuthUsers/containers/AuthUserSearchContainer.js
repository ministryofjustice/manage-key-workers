import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import { resetError, setLoaded } from '../../../redux/actions/index'
import AuthUserSearch from '../components/AuthUserSearch'
import Page from '../../../Components/Page'
import searchComponent from './AuthUserSearchHoc'

class AuthUserSearchContainer extends Component {
  constructor(props) {
    super(props)
    props.resetErrorDispatch()
  }

  async componentDidMount() {
    const { dispatchLoaded } = this.props
    dispatchLoaded(true)
  }

  render() {
    const {
      location: { search: user },
      handleSearch,
      handleChange,
    } = this.props

    return (
      <Page title="Search for auth user" alwaysRender>
        <AuthUserSearch handleSearch={handleSearch} handleChange={handleChange} user={user} />
      </Page>
    )
  }
}

AuthUserSearchContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  resetErrorDispatch: () => dispatch(resetError()),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

export default withRouter(
  searchComponent(
    connect(
      null,
      mapDispatchToProps
    )(AuthUserSearchContainer)
  )
)
