import React from 'react';
import { Header } from 'new-nomis-shared-components';
import {
  BrowserRouter as Router, Link,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import HomePage from './index';
import KeyworkerProfileContainer from '../KeyworkerProfile/containers/KeyworkerProfileContainer';
import KeyworkerProfileEditContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditContainer';
import KeyworkerProfileEditConfirmContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditConfirmContainer';
import KeyworkerSearchContainer from '../KeyworkerProfile/containers/KeyworkerSearchContainer';
import KeyworkerSettingsContainer from '../Admin/containers/KeyworkerSettingsContainer';
import KeyworkerSearchResultsContainer from '../KeyworkerProfile/containers/KeyworkerSearchResultsContainer';
import KeyworkerReports from '../KeyworkerReports/index';
import AssignTransferContainer from '../AssignTransfer/AssignTransferContainer';
import UnallocatedContainer from '../AutoAllocation/containers/Unallocated';
import ProvisionalAllocationContainer from '../AutoAllocation/containers/Provisional';
import AllocationHistoryContainer from '../AllocationHistory/containers/AllocationHistoryContainer';
import EnableNomisContainer from '../Admin/containers/EnableNomisContainer';
import UserSearchContainer from '../Admin/MaintainRoles/containers/UserSearchContainer';
import UserSearchResultsContainer from '../Admin/MaintainRoles/containers/UserSearchResultsContainer';
import StaffRoleProfileContainer from '../Admin/MaintainRoles/containers/StaffRoleProfileContainer';
import AddRoleContainer from '../Admin/MaintainRoles/containers/AddRoleContainer';
import Footer from '../Footer/index';
import Terms from '../Footer/terms-and-conditions';
import Error from "../Error/index";
import links from "../links";

import {
  switchAgency,
  setTermsVisibility,
  setError, resetError,
  setConfig,
  setUserDetails,
  setMessage,
  setMenuOpen,
  setSettings
} from '../redux/actions/index';


const axios = require('axios');

class App extends React.Component {
  constructor (props) {
    super(props);
    this.onFinishAllocation = this.onFinishAllocation.bind(this);
    this.switchCaseLoad = this.switchCaseLoad.bind(this);
    this.showTermsAndConditions = this.showTermsAndConditions.bind(this);
    this.hideTermsAndConditions = this.hideTermsAndConditions.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.resetError = this.resetError.bind(this);
    this.displayError = this.displayError.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async componentDidMount () {
    const { configDispatch, setErrorDispatch } = this.props;

    axios.interceptors.response.use((config) => {
      if (config.status === 205) {
        alert("There is a newer version of this website available, click ok to ensure you're using the latest version."); // eslint-disable-line no-alert
        window.location = '/auth/logout';
      }
      return config;
    }, (error) => Promise.reject(error));

    try {
      await this.loadUserAndCaseload();
      const config = await axios.get('/api/config');
      links.notmEndpointUrl = config.data.notmEndpointUrl;

      if (config.data.googleAnalyticsId) {
        ReactGA.initialize(config.data.googleAnalyticsId);
      }

      configDispatch(config.data);
    } catch (error) {
      setErrorDispatch(error.message);
    }
  }

  onFinishAllocation (history) {
    history.push('/');
  }

  async loadUserAndCaseload () {
    const { userDetailsDispatch, keyworkerSettingsDispatch } = this.props;
    const user = await axios.get('/api/me');
    const caseloads = await axios.get('/api/usercaseloads');
    const keyworkerSettings = await axios.get('/api/keyworkerSettings');

    userDetailsDispatch({ ...user.data, caseLoadOptions: caseloads.data });
    keyworkerSettingsDispatch(keyworkerSettings.data);
  }

  async switchCaseLoad (newCaseload) {
    const { switchAgencyDispatch, setErrorDispatch } = this.props;

    try {
      await axios.put('/api/setactivecaseload', { caseLoadId: newCaseload });
      switchAgencyDispatch(newCaseload);
      await this.loadUserAndCaseload();
    } catch (error) {
      setErrorDispatch(error.message);
    }
  }

  showTermsAndConditions () {
    const { setTermsVisibilityDispatch } = this.props;

    setTermsVisibilityDispatch(true);
  }

  hideTermsAndConditions () {
    const { setTermsVisibilityDispatch } = this.props;

    setTermsVisibilityDispatch(false);
  }

  clearMessage () {
    const { setMessageDispatch } = this.props;

    setMessageDispatch(null);
  }

  resetError () {
    const { resetErrorDispatch } = this.props;

    resetErrorDispatch();
  }

  displayError (error) {
    const { setErrorDispatch } = this.props;

    setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  handleError (error) {
    const { setErrorDispatch } = this.props;

    if ((error.response && error.response.status === 401) && (error.response.data && error.response.data.reason === 'session-expired')) {
      this.displayAlertAndLogout("Your session has expired, please click OK to be redirected back to the login page");
    } else {
      setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
    }
  }

  displayAlertAndLogout (message) {
    alert(message); // eslint-disable-line no-alert
    window.location = '/auth/logout';
  }

  shouldDisplayInnerContent () {
    const { shouldShowTerms, user } = this.props;

    return !shouldShowTerms && (user && user.activeCaseLoadId);
  }

  displayBack () {
    return (<div className="padding-top"><Link id="back_to_menu_link" title="Back to menu link" className="link backlink" to="/" >
      <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</Link></div>);
  }

  render () {
    const { setMenuOpen, config, shouldShowTerms } = this.props;
    let innerContent;
    const routes = (<div className="inner-content" onClick={() => setMenuOpen(false)} ><div className="pure-g">
      <Route exact path="/" render={() => <HomePage {...this.props} clearMessage={this.clearMessage}/>}/>
      <Route exact path="/keyworkerReports" render={() => <KeyworkerReports {...this.props} />}/>
      <Route exact path="/offender/search" render={() => <AssignTransferContainer initialSearch displayBack={this.displayBack} handleError={this.handleError} {...this.props} />}/>
      <Route exact path="/offender/:offenderNo/history" render={() => <AllocationHistoryContainer handleError={this.handleError} clearMessage={this.clearMessage} {...this.props} />}/>
      <Route exact path="/unallocated" render={() => <UnallocatedContainer displayBack={this.displayBack} handleError={this.handleError} {...this.props}/>}/>
      <Route exact path="/provisionalAllocation" render={() => <ProvisionalAllocationContainer handleError={this.handleError} onFinishAllocation={this.onFinishAllocation} {...this.props}/>}/>
      <Route exact path="/keyworker/search" render={() => <KeyworkerSearchContainer displayBack={this.displayBack} handleError={this.handleError} {...this.props} />}/>
      <Route exact path="/keyworker/results" render={() => <KeyworkerSearchResultsContainer displayBack={this.displayBack} handleError={this.handleError} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile" render={() => <KeyworkerProfileContainer handleError={this.handleError} clearMessage={this.clearMessage} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile/edit" render={() => <KeyworkerProfileEditContainer handleError={this.handleError} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile/edit/confirm" render={() => <KeyworkerProfileEditConfirmContainer handleError={this.handleError} {...this.props} />}/>
      <Route exact path="/offender/results" render={() => <AssignTransferContainer onFinishAllocation={this.onFinishAllocation} displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props} />}/>
      <Route exact path="/admin/nomis/access" render={() => <EnableNomisContainer displayBack={this.displayBack} handleError={this.handleError} {...this.props}/>}/>
      <Route exact path="/admin/settings" render={() => <KeyworkerSettingsContainer displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props}/>}/>
      <Route exact path="/maintainRoles/search" render={() => <UserSearchContainer displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props}/>}/>
      <Route exact path="/maintainRoles/results" render={() => <UserSearchResultsContainer displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props}/>}/>
      <Route exact path="/maintainRoles/:username/profile" render={() => <StaffRoleProfileContainer displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props}/>}/>
      <Route exact path="/maintainRoles/:username/addRole" render={() => <AddRoleContainer displayBack={this.displayBack} handleError={this.handleError} clearMessage={this.clearMessage} {...this.props}/>}/>
    </div></div>);

    if (this.shouldDisplayInnerContent()) {
      innerContent = routes;
    } else {
      innerContent = (<div className="inner-content" onClick={() => setMenuOpen(false)}><div className="pure-g"><Error {...this.props} /></div></div>);
    }
    return (
      <Router>
        <div className="content">
          <Route render={(props) => {
            if (config.googleAnalyticsId) {
              ReactGA.pageview(props.location.pathname);
            }
            return (<Header
              logoText="HMPPS"
              title="Prison-NOMIS"
              homeLink={links.getHomeLink()}
              switchCaseLoad={this.switchCaseLoad}
              history={props.history}
              resetError={this.resetError}
              {...this.props}
            />);
          }}
          />
          {shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          {innerContent}
          <Footer
            setMenuOpen={setMenuOpen}
            showTermsAndConditions={this.showTermsAndConditions}
            mailTo={config.mailTo}
          />
        </div>
      </Router>);
  }
}

App.propTypes = {
  error: PropTypes.string,
  page: PropTypes.number,
  config: PropTypes.object,
  user: PropTypes.object,
  shouldShowTerms: PropTypes.bool,
  configDispatch: PropTypes.func.isRequired,
  userDetailsDispatch: PropTypes.func.isRequired,
  switchAgencyDispatch: PropTypes.func.isRequired,
  setTermsVisibilityDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func,
  keyworkerSettingsDispatch: PropTypes.func,
  setMessageDispatch: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  allowAuto: PropTypes.bool
};

const mapStateToProps = state => ({
    error: state.app.error,
    message: state.app.message,
    page: state.app.page,
    config: state.app.config,
    user: state.app.user,
    shouldShowTerms: state.app.shouldShowTerms,
    menuOpen: state.app.menuOpen,
    allowAuto: state.keyworkerSettings.allowAuto
  });

const mapDispatchToProps = dispatch => ({
    configDispatch: (config) => dispatch(setConfig(config)),
    userDetailsDispatch: (user) => dispatch(setUserDetails(user)),
    switchAgencyDispatch: (agencyId) => dispatch(switchAgency(agencyId)),
    setTermsVisibilityDispatch: (shouldShowTerms) => dispatch(setTermsVisibility(shouldShowTerms)),
    setErrorDispatch: (error) => dispatch(setError(error)),
    resetErrorDispatch: () => dispatch(resetError()),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setMenuOpen: (flag) => dispatch(setMenuOpen(flag)),
    keyworkerSettingsDispatch: (settings) => dispatch(setSettings(settings))
  });

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export {
  App,
  AppContainer
};
export default App;
