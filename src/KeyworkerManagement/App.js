/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import Header from '../Header'
import UnauthPage from './unauthPage'
import KeyworkerProfileContainer from '../KeyworkerProfile/containers/KeyworkerProfileContainer'
import KeyworkerProfileEditContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditContainer'
import KeyworkerProfileEditConfirmContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditConfirmContainer'
import KeyworkerSearchContainer from '../KeyworkerProfile/containers/KeyworkerSearchContainer'
import KeyworkerSearchResultsContainer from '../KeyworkerProfile/containers/KeyworkerSearchResultsContainer'
import KeyworkerReports from '../KeyworkerReports/index'
import AssignTransferContainer from '../AssignTransfer/AssignTransferContainer'
import UnallocatedContainer from '../AutoAllocation/containers/Unallocated'
import ProvisionalAllocationContainer from '../AutoAllocation/containers/Provisional'
import AllocationHistoryContainer from '../AllocationHistory/containers/AllocationHistoryContainer'
import KeyworkerDashboard from '../KeyworkerDashboard/KeyworkerDashboard'
import FeedbackBanner from '../FeedbackBanner/FeedbackBanner'
import Terms from '../Footer/terms-and-conditions'
import Error from '../Error/index'
import links from '../links'
import {
  resetError,
  setConfig,
  setError,
  setLoaded,
  setMessage,
  setSettings,
  setTermsVisibility,
  setUserDetails,
} from '../redux/actions/index'
import { configType, errorType, userType } from '../types'
import FooterContainer from '../Components/FooterContainer'

const axios = require('axios')

class App extends React.Component {
  async componentDidMount() {
    const { configDispatch, setErrorDispatch } = this.props

    axios.interceptors.response.use(
      (config) => {
        if (config.status === 205) {
          // eslint-disable-next-line no-alert
          alert(
            "There is a newer version of this website available, click ok to ensure you're using the latest version."
          )
          window.location = '/auth/logout'
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    let headerHtml
    let footerHtml
    try {
      const feComponents = await axios.get('/api/getFeComponents')
      headerHtml = feComponents.data.header.html
      footerHtml = feComponents.data.footer.html
    } catch (error) {
      // use fallback header and footer
    }

    try {
      await this.loadUserAndCaseload()
      const config = await axios.get('/api/config')
      links.notmEndpointUrl = config.data.notmEndpointUrl

      if (config.data.googleAnalyticsId) {
        ReactGA.initialize(config.data.googleAnalyticsId)
      }

      configDispatch({
        ...config.data,
        headerHtml,
        footerHtml,
      })
    } catch (error) {
      setErrorDispatch(error.message)
    }
  }

  onFinishAllocation = (history) => {
    history.push('/')
  }

  loadUserAndCaseload = async () => {
    const { userDetailsDispatch, keyworkerSettingsDispatch } = this.props
    const user = await axios.get('/api/me')
    const caseloads = await axios.get('/api/usercaseloads')
    const keyworkerSettings = await axios.get('/api/keyworkerSettings')
    keyworkerSettingsDispatch(keyworkerSettings.data)
    userDetailsDispatch({ ...user.data, caseLoadOptions: caseloads.data })
  }

  showTermsAndConditions = () => {
    const { setTermsVisibilityDispatch } = this.props
    setTermsVisibilityDispatch(true)
  }

  hideTermsAndConditions = () => {
    const { setTermsVisibilityDispatch } = this.props
    setTermsVisibilityDispatch(false)
  }

  clearMessage = () => {
    const { setMessageDispatch } = this.props
    setMessageDispatch('')
  }

  resetError = () => {
    const { resetErrorDispatch } = this.props
    resetErrorDispatch()
  }

  displayError = (error) => {
    const { setErrorDispatch } = this.props
    setErrorDispatch((error.response && error.response.data) || `Something went wrong: ${error}`)
  }

  handleError = (error) => {
    const { setErrorDispatch } = this.props

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.reason === 'session-expired'
    ) {
      this.displayAlertAndLogout('Your session has expired, please click OK to be redirected back to the login page')
    } else {
      setErrorDispatch((error.response && error.response.data) || `Something went wrong: ${error}`)
    }
  }

  displayAlertAndLogout = (message) => {
    alert(message) // eslint-disable-line no-alert
    window.location = '/auth/logout'
  }

  shouldDisplayInnerContent = () => {
    const { shouldShowTerms, user } = this.props
    return !shouldShowTerms && user && user.username
  }

  // noinspection HtmlUnknownTarget
  displayBack = () => (
    <div className="padding-top">
      <Link id="back_to_menu_link" title="Back to menu link" className="link backlink" to="/">
        <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
      </Link>
    </div>
  )

  render() {
    const { config, shouldShowTerms, error, user, migrated, dispatchLoaded } = this.props

    let innerContent
    const routes = (
      // eslint-disable-next-line
      <div className="inner-content">
        <div className="pure-g">
          <Switch>
            <Route exact path="/unauthorised" render={() => <UnauthPage dispatchLoaded={dispatchLoaded} />} />
            <Route
              exact
              path="/key-worker-statistics"
              render={() => (
                <KeyworkerDashboard migrated={migrated} displayBack={this.displayBack} handleError={this.handleError} />
              )}
            />
            <Route exact path="/keyworkerReports" render={() => <KeyworkerReports />} />
            <Route
              exact
              path="/offender-search"
              render={() => (
                <AssignTransferContainer initialSearch displayBack={this.displayBack} handleError={this.handleError} />
              )}
            />
            <Route
              exact
              path="/offender-search/results"
              render={() => (
                <AssignTransferContainer
                  onFinishAllocation={this.onFinishAllocation}
                  displayBack={this.displayBack}
                  handleError={this.handleError}
                  clearMessage={this.clearMessage}
                />
              )}
            />
            <Route
              exact
              path="/offender-history/:offenderNo"
              render={() => (
                <AllocationHistoryContainer handleError={this.handleError} clearMessage={this.clearMessage} />
              )}
            />
            <Route
              exact
              path="/unallocated"
              render={() => <UnallocatedContainer displayBack={this.displayBack} handleError={this.handleError} />}
            />
            <Route
              exact
              path="/unallocated/provisional-allocation"
              render={() => (
                <ProvisionalAllocationContainer
                  handleError={this.handleError}
                  onFinishAllocation={this.onFinishAllocation}
                />
              )}
            />
            <Route
              exact
              path="/key-worker-search"
              render={() => (
                <KeyworkerSearchContainer
                  displayBack={this.displayBack}
                  handleError={this.handleError}
                  dispatchLoaded={dispatchLoaded}
                />
              )}
            />
            <Route
              exact
              path="/key-worker-search/results"
              render={() => (
                <KeyworkerSearchResultsContainer displayBack={this.displayBack} handleError={this.handleError} />
              )}
            />
            <Route
              exact
              path="/key-worker/:staffId"
              render={() => (
                <KeyworkerProfileContainer handleError={this.handleError} clearMessage={this.clearMessage} />
              )}
            />
            <Route
              exact
              path="/key-worker/:staffId/edit"
              render={() => <KeyworkerProfileEditContainer handleError={this.handleError} />}
            />
            <Route
              exact
              path="/key-worker/:staffId/confirm-edit"
              render={() => <KeyworkerProfileEditConfirmContainer handleError={this.handleError} />}
            />
          </Switch>
        </div>
      </div>
    )

    const shouldShowFeedbackBanner = !config.footerHtml
    if (this.shouldDisplayInnerContent()) {
      innerContent = routes
    } else {
      innerContent = (
        // eslint-disable-next-line
        <div className="inner-content">
          <div className="pure-g">
            <Error error={error} />
          </div>
        </div>
      )
    }

    return (
      <Router>
        <div className="content">
          <Route
            render={(props) => {
              if (config.googleAnalyticsId) {
                ReactGA.pageview(props.location.pathname)
              }

              return (
                <Header
                  dpsUrl={config.prisonStaffHubUrl}
                  authUrl={config.authUrl}
                  user={user}
                  headerHtml={config.headerHtml}
                />
              )
            }}
          />
          {shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          {innerContent}
          {shouldShowFeedbackBanner && (
            <div className="dashboard-feedback-banner">
              <FeedbackBanner />
            </div>
          )}
          <FooterContainer
            supportUrl={config.supportUrl}
            prisonStaffHubUrl={config.prisonStaffHubUrl}
            footerHtml={config.footerHtml}
          />
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  error: errorType.isRequired,
  config: configType.isRequired,
  user: userType.isRequired,
  shouldShowTerms: PropTypes.bool.isRequired,
  configDispatch: PropTypes.func.isRequired,
  userDetailsDispatch: PropTypes.func.isRequired,
  setTermsVisibilityDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  keyworkerSettingsDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  migrated: PropTypes.bool.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  error: state.app.error,
  message: state.app.message,
  config: state.app.config,
  user: state.app.user,
  shouldShowTerms: state.app.shouldShowTerms,
  menuOpen: state.app.menuOpen,
  allowAuto: state.keyworkerSettings.allowAuto,
  migrated: state.keyworkerSettings.migrated,
})

const mapDispatchToProps = (dispatch) => ({
  configDispatch: (config) => dispatch(setConfig(config)),
  userDetailsDispatch: (user) => dispatch(setUserDetails(user)),
  setTermsVisibilityDispatch: (shouldShowTerms) => dispatch(setTermsVisibility(shouldShowTerms)),
  setErrorDispatch: (error) => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setMessageDispatch: (message) => dispatch(setMessage(message)),
  keyworkerSettingsDispatch: (settings) => dispatch(setSettings(settings)),
  dispatchLoaded: (value) => dispatch(setLoaded(value)),
})

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App)

export { App, AppContainer }
export default App
