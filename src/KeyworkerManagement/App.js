import React from 'react';
import HomePage from './index';
import KeyworkerProfileContainer from '../KeyworkerProfile/containers/KeyworkerProfileContainer';
import KeyworkerProfileEditContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditContainer';
import KeyworkerProfileEditConfirmContainer from '../KeyworkerProfile/containers/KeyworkerProfileEditConfirmContainer';
import KeyworkerSearchContainer from '../KeyworkerProfile/containers/KeyworkerSearchContainer';
import KeyworkerSearchResultsContainer from '../KeyworkerProfile/containers/KeyworkerSearchResultsContainer';
import KeyworkerReports from '../KeyworkerReports/index';
import AssignTransferContainer from '../AssignTransfer/AssignTransferContainer';
import UnallocatedContainer from '../AutoAllocation/containers/Unallocated';
import ProvisionalAllocationContainer from '../AutoAllocation/containers/Provisional';
import AllocationHistoryContainer from '../AllocationHistory/containers/AllocationHistoryContainer';
import Header from '../Header/index';
import Footer from '../Footer/index';
import Terms from '../Footer/terms-and-conditions';
import Error from "../Error/index";
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { switchAgency, setTermsVisibility, setError, resetError, setConfig, setUserDetails, setMessage } from '../redux/actions/index';
import { connect } from 'react-redux';
import links from "../links";
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
      const user = await axios.get('/api/me');
      const caseloads = await axios.get('/api/usercaseloads');
      this.props.userDetailsDispatch({ ...user.data, caseLoadOptions: caseloads.data });

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

  async switchCaseLoad (newCaseload) {
    try {
      await axios.put('/api/setactivecaseload', { caseLoadId: newCaseload });
      this.props.switchAgencyDispatch(newCaseload);
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

  shouldDisplayInnerContent () {
    return !this.props.shouldShowTerms && (this.props.user && this.props.user.activeCaseLoadId);
  }

  render () {
    let innerContent;
    const routes = (<div className="inner-content"><div className="pure-g">
      <Route exact path="/" render={() => <HomePage {...this.props} clearMessage={this.clearMessage}/>}/>
      <Route exact path="/keyworkerReports" render={() => <KeyworkerReports {...this.props} />}/>
      <Route exact path="/offender/search" render={() => <AssignTransferContainer initialSearch displayError={this.displayError} {...this.props} />}/>
      <Route exact path="/offender/:offenderNo/history" render={() => <AllocationHistoryContainer displayError={this.displayError} clearMessage={this.clearMessage} {...this.props} />}/>
      <Route exact path="/unallocated" render={() => <UnallocatedContainer displayError={this.displayError} {...this.props}/>}/>
      <Route exact path="/provisionalAllocation" render={() => <ProvisionalAllocationContainer displayError={this.displayError} onFinishAllocation={this.onFinishAllocation} {...this.props}/>}/>
      <Route exact path="/keyworker/search" render={() => <KeyworkerSearchContainer displayError={this.displayError} {...this.props} />}/>
      <Route exact path="/keyworker/results" render={() => <KeyworkerSearchResultsContainer displayError={this.displayError} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile" render={() => <KeyworkerProfileContainer displayError={this.displayError} clearMessage={this.clearMessage} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile/edit" render={() => <KeyworkerProfileEditContainer displayError={this.displayError} {...this.props} />}/>
      <Route exact path="/keyworker/:staffId/profile/edit/confirm" render={() => <KeyworkerProfileEditConfirmContainer displayError={this.displayError} {...this.props} />}/>
      <Route exact path="/offender/results" render={() => <AssignTransferContainer onFinishAllocation={this.onFinishAllocation} displayError={this.displayError} clearMessage={this.clearMessage} {...this.props} />}/>
    </div></div>);

    if (this.shouldDisplayInnerContent()) {
      innerContent = routes;
    } else {
      innerContent = (<div className="inner-content"><div className="pure-g"><Error {...this.props} /></div></div>);
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
          <Footer showTermsAndConditions={this.showTermsAndConditions} mailTo={this.props.config.mailTo}/>
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
  setMessageDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.app.error,
    message: state.app.message,
    page: state.app.page,
    config: state.app.config,
    user: state.app.user,
    shouldShowTerms: state.app.shouldShowTerms
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
    setMessageDispatch: (message) => dispatch(setMessage(message))
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export {
  App,
  AppContainer
};
export default App;
