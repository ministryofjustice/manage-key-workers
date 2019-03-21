/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { Header, FooterContainer } from 'new-nomis-shared-components'
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import HomePage from './index'
import KeyworkerProfileContainer from '../KeyworkerProfile/containers/KeyworkerProfileContainer'
import KeyworkerProfileEditContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditContainer'
import KeyworkerProfileEditConfirmContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditConfirmContainer'
import KeyworkerSearchContainer from '../KeyworkerProfile/containers/KeyworkerSearchContainer'
import KeyworkerSettingsContainer from '../Admin/containers/KeyworkerSettingsContainer'
import KeyworkerSearchResultsContainer from '../KeyworkerProfile/containers/KeyworkerSearchResultsContainer'
import KeyworkerReports from '../KeyworkerReports/index'
import AssignTransferContainer from '../AssignTransfer/AssignTransferContainer'
import UnallocatedContainer from '../AutoAllocation/containers/Unallocated'
import ProvisionalAllocationContainer from '../AutoAllocation/containers/Provisional'
import AllocationHistoryContainer from '../AllocationHistory/containers/AllocationHistoryContainer'
import EnableNomisContainer from '../Admin/containers/EnableNomisContainer'
import AdminUtilitiesContainer from '../Admin/containers/AdminUtilitiesContainer'
import AuthUserSearchContainer from '../Admin/MaintainAuthUsers/containers/AuthUserSearchContainer'
import AuthUserSearchResultsContainer from '../Admin/MaintainAuthUsers/containers/AuthUserSearchResultsContainer'
import UserSearchContainer from '../Admin/MaintainRoles/containers/UserSearchContainer'
import UserSearchResultsContainer from '../Admin/MaintainRoles/containers/UserSearchResultsContainer'
import StaffRoleProfileContainer from '../Admin/MaintainRoles/containers/StaffRoleProfileContainer'
import AddRoleContainer from '../Admin/MaintainRoles/containers/AddRoleContainer'
import KeyworkerDashboard from '../KeyworkerDashboard/KeyworkerDashboard'
import Terms from '../Footer/terms-and-conditions'
import Error from '../Error/index'
import links from '../links'
import {
  switchAgency,
  setTermsVisibility,
  setError,
  resetError,
  setConfig,
  setUserDetails,
  setMessage,
  setMenuOpen,
  setSettings,
  setLoaded,
} from '../redux/actions/index'
import { configType, userType } from '../types'

const axios = require('axios')

class App extends React.Component {
  async componentDidMount() {
    const { configDispatch, setErrorDispatch } = this.props

    axios.interceptors.response.use(
      config => {
        if (config.status === 205) {
          // eslint-disable-next-line no-alert
          alert(
            "There is a newer version of this website available, click ok to ensure you're using the latest version."
          )
          window.location = '/auth/logout'
        }
        return config
      },
      error => Promise.reject(error)
    )

    try {
      await this.loadUserAndCaseload()
      const config = await axios.get('/api/config')
      links.notmEndpointUrl = config.data.notmEndpointUrl

      if (config.data.googleAnalyticsId) {
        ReactGA.initialize(config.data.googleAnalyticsId)
      }

      configDispatch(config.data)
    } catch (error) {
      setErrorDispatch(error.message)
    }
  }

  onFinishAllocation = history => {
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

  switchCaseLoad = async newCaseload => {
    const { switchAgencyDispatch } = this.props

    try {
      await axios.put('/api/setactivecaseload', { caseLoadId: newCaseload })
      await this.loadUserAndCaseload()
      switchAgencyDispatch(newCaseload)
    } catch (error) {
      this.handleError(error)
    }
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

  displayError = error => {
    const { setErrorDispatch } = this.props
    setErrorDispatch((error.response && error.response.data) || `Something went wrong: ${error}`)
  }

  handleError = error => {
    const { setErrorDispatch } = this.props

    if (
      error.response &&
      error.response.status === 401 &&
      (error.response.data && error.response.data.reason === 'session-expired')
    ) {
      this.displayAlertAndLogout('Your session has expired, please click OK to be redirected back to the login page')
    } else {
      setErrorDispatch((error.response && error.response.data) || `Something went wrong: ${error}`)
    }
  }

  displayAlertAndLogout = message => {
    alert(message) // eslint-disable-line no-alert
    window.location = '/auth/logout'
  }

  shouldDisplayInnerContent = () => {
    const { shouldShowTerms, user } = this.props
    return !shouldShowTerms && (user && user.username)
  }

  displayBack = () => (
    <div className="padding-top">
      <Link id="back_to_menu_link" title="Back to menu link" className="link backlink" to="/">
        <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
      </Link>
    </div>
  )

  render() {
    const {
      boundSetMenuOpen,
      config,
      shouldShowTerms,
      error,
      allowAuto,
      user,
      message,
      migrated,
      dispatchLoaded,
    } = this.props
    let innerContent
    const routes = (
      // eslint-disable-next-line
      <div className="inner-content" onClick={() => boundSetMenuOpen(false)}>
        <div className="pure-g">
          <Route
            path="(/)"
            render={() => <Route exact path="/" render={() => <Redirect to="/manage-key-workers" />} />}
          />
          <Route
            exact
            path="/manage-key-workers"
            render={() => (
              <HomePage
                allowAuto={allowAuto}
                migrated={migrated}
                user={user}
                config={config}
                message={message}
                clearMessage={this.clearMessage}
                dispatchLoaded={dispatchLoaded}
              />
            )}
          />

          <Route
            exact
            path="/manage-key-workers/key-worker-statistics"
            render={() => (
              <KeyworkerDashboard migrated={migrated} displayBack={this.displayBack} handleError={this.handleError} />
            )}
          />
          <Route exact path="/keyworkerReports" render={() => <KeyworkerReports />} />
          <Route
            exact
            path="/manage-key-workers/offender-search"
            render={() => (
              <AssignTransferContainer initialSearch displayBack={this.displayBack} handleError={this.handleError} />
            )}
          />
          <Route
            exact
            path="/manage-key-workers/offender-search/results"
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
            path="/manage-key-workers/offender-history/:offenderNo"
            render={() => (
              <AllocationHistoryContainer handleError={this.handleError} clearMessage={this.clearMessage} />
            )}
          />
          <Route
            exact
            path="/manage-key-workers/unallocated"
            render={() => <UnallocatedContainer displayBack={this.displayBack} handleError={this.handleError} />}
          />
          <Route
            exact
            path="/manage-key-workers/unallocated/provisional-allocation"
            render={() => (
              <ProvisionalAllocationContainer
                handleError={this.handleError}
                onFinishAllocation={this.onFinishAllocation}
              />
            )}
          />
          <Route
            exact
            path="/manage-key-workers/key-worker-search"
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
            path="/manage-key-workers/key-worker-search/results"
            render={() => (
              <KeyworkerSearchResultsContainer displayBack={this.displayBack} handleError={this.handleError} />
            )}
          />
          <Route
            exact
            path="/manage-key-workers/key-worker/:staffId"
            render={() => <KeyworkerProfileContainer handleError={this.handleError} clearMessage={this.clearMessage} />}
          />
          <Route
            exact
            path="/manage-key-workers/key-worker/:staffId/edit"
            render={() => <KeyworkerProfileEditContainer handleError={this.handleError} />}
          />
          <Route
            exact
            path="/manage-key-workers/key-worker/:staffId/confirm-edit"
            render={() => <KeyworkerProfileEditConfirmContainer handleError={this.handleError} />}
          />
          <Route
            exact
            path="/admin-utilities"
            render={() => (
              <AdminUtilitiesContainer
                handleError={this.handleError}
                message={message}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/give-nomis-access"
            render={() => <EnableNomisContainer displayBack={this.displayBack} handleError={this.handleError} />}
          />
          <Route
            exact
            path="/admin-utilities/manage-key-worker-settings"
            render={() => (
              <KeyworkerSettingsContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-roles"
            render={() => (
              <UserSearchContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-roles/search-results"
            render={() => (
              <UserSearchResultsContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-roles/:username/roles"
            render={() => (
              <StaffRoleProfileContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-roles/:username/roles/add-role"
            render={() => (
              <AddRoleContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-auth-users"
            render={() => (
              <AuthUserSearchContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
          <Route
            exact
            path="/admin-utilities/maintain-auth-users/search-results"
            render={() => (
              <AuthUserSearchResultsContainer
                displayBack={this.displayBack}
                handleError={this.handleError}
                clearMessage={this.clearMessage}
              />
            )}
          />
        </div>
      </div>
    )

    if (this.shouldDisplayInnerContent()) {
      innerContent = routes
    } else {
      innerContent = (
        // eslint-disable-next-line
        <div className="inner-content" onClick={() => boundSetMenuOpen(false)}>
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
            render={props => {
              if (config.googleAnalyticsId) {
                ReactGA.pageview(props.location.pathname)
              }

              return (
                <Header
                  logoText="HMPPS"
                  title="Prison-NOMIS"
                  homeLink={links.getHomeLink()}
                  switchCaseLoad={newCaseload => {
                    this.switchCaseLoad(newCaseload)
                    const routesThatDontRedirectAfterCaseloadSwitch = ['/manage-key-workers/key-worker-statistics']

                    if (routesThatDontRedirectAfterCaseloadSwitch.includes(props.location.pathname) === false) {
                      props.history.push('/')
                    }
                  }}
                  history={props.history}
                  resetError={this.resetError}
                  setMenuOpen={boundSetMenuOpen}
                  caseChangeRedirect={false}
                  {...this.props}
                />
              )
            }}
          />
          {shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          {innerContent}
          <FooterContainer feedbackEmail={config.mailTo} prisonStaffHubUrl={config.prisonStaffHubUrl} />
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  error: PropTypes.string.isRequired,
  config: configType.isRequired,
  user: userType.isRequired,
  shouldShowTerms: PropTypes.bool.isRequired,
  configDispatch: PropTypes.func.isRequired,
  userDetailsDispatch: PropTypes.func.isRequired,
  switchAgencyDispatch: PropTypes.func.isRequired,
  setTermsVisibilityDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  keyworkerSettingsDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  boundSetMenuOpen: PropTypes.func.isRequired,
  allowAuto: PropTypes.bool.isRequired,
  migrated: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  message: state.app.message,
  config: state.app.config,
  user: state.app.user,
  shouldShowTerms: state.app.shouldShowTerms,
  menuOpen: state.app.menuOpen,
  allowAuto: state.keyworkerSettings.allowAuto,
  migrated: state.keyworkerSettings.migrated,
})

const mapDispatchToProps = dispatch => ({
  configDispatch: config => dispatch(setConfig(config)),
  userDetailsDispatch: user => dispatch(setUserDetails(user)),
  switchAgencyDispatch: agencyId => dispatch(switchAgency(agencyId)),
  setTermsVisibilityDispatch: shouldShowTerms => dispatch(setTermsVisibility(shouldShowTerms)),
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  setMessageDispatch: message => dispatch(setMessage(message)),
  boundSetMenuOpen: flag => dispatch(setMenuOpen(flag)),
  keyworkerSettingsDispatch: settings => dispatch(setSettings(settings)),
  dispatchLoaded: value => dispatch(setLoaded(value)),
})

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export { App, AppContainer }
export default App
