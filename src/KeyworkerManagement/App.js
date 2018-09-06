import React from 'react';
import HomePage from './index';
import KeyworkerProfileContainer from '../KeyworkerProfile/containers/KeyworkerProfileContainer';
import KeyworkerProfileEditContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditContainer';
import KeyworkerProfileEditConfirmContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditConfirmContainer';
import KeyworkerSearchContainer from '../KeyworkerProfile/containers/KeyworkerSearchContainer';
import KeyworkerSettingsContainer from '../admin/containers/KeyworkerSettingsContainer';
import KeyworkerSearchResultsContainer from '../KeyworkerProfile/containers/KeyworkerSearchResultsContainer';
import KeyworkerReports from '../KeyworkerReports/index';
import AssignTransferContainer from '../AssignTransfer/AssignTransferContainer';
import UnallocatedContainer from '../AutoAllocation/containers/Unallocated';
import ProvisionalAllocationContainer from '../AutoAllocation/containers/Provisional';
import AllocationHistoryContainer from '../AllocationHistory/containers/AllocationHistoryContainer';
import EnableNomisContainer from '../Admin/containers/EnableNomisContainer';
import Header from '../Header/index';
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

import {
  BrowserRouter as Router, Link,
  Route
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
const axios = require('axios');

class App extends React.Component {
  constructor (props) {
    super();
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

      this.props.configDispatch(config.data);
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  onFinishAllocation (history) {
    history.push('/');
  }

  async loadUserAndCaseload () {
    const user = await axios.get('/api/me');
    const caseloads = await axios.get('/api/usercaseloads');
    const keyworkerSettings = await axios.get('/api/keyworkerSettings');
    this.props.userDetailsDispatch({ ...user.data, caseLoadOptions: caseloads.data });
    this.props.keyworkerSettingsDispatch(keyworkerSettings.data);
  }

  async switchCaseLoad (newCaseload) {
    try {
      await axios.put('/api/setactivecaseload', { caseLoadId: newCaseload });
      this.props.switchAgencyDispatch(newCaseload);
      await this.loadUserAndCaseload();
    } catch (error) {
      this.props.setErrorDispatch(error.message);
    }
  }

  showTermsAndConditions () {
    this.props.setTermsVisibilityDispatch(true);
  }

  hideTermsAndConditions () {
    this.props.setTermsVisibilityDispatch(false);
  }

  clearMessage () {
    this.props.setMessageDispatch(null);
  }

  resetError () {
    this.props.resetErrorDispatch();
  }

  displayError (error) {
    this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  handleError (error) {
    if ((error.response && error.response.status === 401) && (error.response.data && error.response.data.message === 'Session expired')) {
      this.displayAlertAndLogout("Your session has expired, please click OK to be redirected back to the login page");
    } else {
      this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
    }
  }

  displayAlertAndLogout (message) {
    alert(message); // eslint-disable-line no-alert
    window.location = '/auth/logout';
  }

  shouldDisplayInnerContent () {
    return !this.props.shouldShowTerms && (this.props.user && this.props.user.activeCaseLoadId);
  }

  displayBack () {
    return (<div className="padding-top"><Link id={`back_to_menu_link`} title="Back to menu link" className="link backlink" to="/" >
      <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10"/> Back</Link></div>);
  }

  render () {
    let innerContent;
    const routes = (<div className="inner-content" onClick={() => this.props.setMenuOpen(false)} ><div className="pure-g">
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
    </div></div>);

    if (this.shouldDisplayInnerContent()) {
      innerContent = routes;
    } else {
      innerContent = (<div className="inner-content" onClick={() => this.props.setMenuOpen(false)}><div className="pure-g"><Error {...this.props} /></div></div>);
    }
    return (
      <Router>
        <div className="content">
          <Route render={(props) => {
            if (this.props.config.googleAnalyticsId) {
              ReactGA.pageview(props.location.pathname);
            }
            return (<Header
              switchCaseLoad={this.switchCaseLoad}
              history={props.history}
              resetError={this.resetError}
              {...this.props}
            />);
          }}
          />
          {this.props.shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          {innerContent}
          <Footer
            setMenuOpen={this.props.setMenuOpen}
            showTermsAndConditions={this.showTermsAndConditions}
            mailTo={this.props.config.mailTo}
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
  setMenuOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.app.error,
    message: state.app.message,
    page: state.app.page,
    config: state.app.config,
    user: state.app.user,
    shouldShowTerms: state.app.shouldShowTerms,
    menuOpen: state.app.menuOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    configDispatch: (config) => dispatch(setConfig(config)),
    userDetailsDispatch: (user) => dispatch(setUserDetails(user)),
    switchAgencyDispatch: (agencyId) => dispatch(switchAgency(agencyId)),
    setTermsVisibilityDispatch: (shouldShowTerms) => dispatch(setTermsVisibility(shouldShowTerms)),
    setErrorDispatch: (error) => dispatch(setError(error)),
    resetErrorDispatch: () => dispatch(resetError()),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setMenuOpen: (flag) => dispatch(setMenuOpen(flag)),
    keyworkerSettingsDispatch: (settings) => dispatch(setSettings(settings))
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export {
  App,
  AppContainer
};
export default App;
