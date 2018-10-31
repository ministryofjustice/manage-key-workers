import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import EnableNomis from '../components/EnableNomis'
import Error from '../../Error'
import { setLoaded, setMessage } from '../../redux/actions'
import Spinner from '../../Spinner'

class EnableNomisContainer extends Component {
  componentWillMount() {
    const { setLoadedDispatch } = this.props

    setLoadedDispatch(true)
  }

  handleEnable = async history => {
    const { agencyId, setLoadedDispatch, setMessageDispatch, handleError } = this.props

    setLoadedDispatch(false)
    try {
      await axios.post(
        '/api/enableNewNomis',
        {},
        {
          params: {
            agencyId,
          },
        }
      )
      setMessageDispatch('New NOMIS access updated')
      history.push(`/`)
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  handleCancel = history => {
    history.push(`/`)
  }

  render() {
    const { error, loaded } = this.props

    if (error) return <Error {...this.props} />

    if (loaded) return <EnableNomis handleEnable={this.handleEnable} handleCancel={this.handleCancel} {...this.props} />

    return <Spinner />
  }
}

EnableNomisContainer.propTypes = {
  error: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
  loaded: state.app.loaded,
})

const mapDispatchToProps = dispatch => ({
  setMessageDispatch: message => dispatch(setMessage(message)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
})

export { EnableNomisContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EnableNomisContainer))
