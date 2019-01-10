import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import EnableNomis from '../components/EnableNomis'
import { setLoaded, setMessage } from '../../redux/actions'
import Page from '../../Components/Page'

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
      history.push(`/admin-utilities`)
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  handleCancel = history => {
    history.push(`/admin-utilities`)
  }

  render() {
    return (
      <Page title="Give access to New NOMIS">
        <EnableNomis handleEnable={this.handleEnable} handleCancel={this.handleCancel} {...this.props} />
      </Page>
    )
  }
}

EnableNomisContainer.propTypes = {
  agencyId: PropTypes.string.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.app.user,
  agencyId: state.app.user.activeCaseLoadId,
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
