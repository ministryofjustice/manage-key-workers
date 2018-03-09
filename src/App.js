import React from 'react';
import { LoginContainer } from './Login/index';
import HomePage from './KeyworkerManagement/index';
import KeyworkerProfileContainer from './KeyworkerProfile/containers/KeyworkerProfileContainer';
import KeyworkerProfileEditContainer from './KeyworkerProfile/containers/KeyworkerProfileEditContainer';
import KeyworkerSearchContainer from './KeyworkerProfile/containers/KeyworkerSearchContainer';
import KeyworkerSearchResultsContainer from './KeyworkerProfile/containers/KeyworkerSearchResultsContainer';
import KeyworkerReports from './KeyworkerReports/index';
import AssignTransferContainer from './AssignTransfer/AssignTransferContainer';
import { AutoAllocateContainer } from './AutoAllocation/container';
import Header from './Header/index';
import Footer from './Footer/index';
import Terms from './Footer/terms-and-conditions';
import OffenderContainer from './AssignTransfer/containers/OffenderContainer';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import axiosWrapper from "./backendWrapper";
import PropTypes from 'prop-types';
import { switchAgency, setTermsVisibility, setError, setLoginDetails, setMessage } from './redux/actions';
import { connect } from 'react-redux';

const axios = require('axios');

class App extends React.Component {
  constructor () {
    super();
    this.onLogin = this.onLogin.bind(this);
    this.onFinishAllocation = this.onFinishAllocation.bind(this);
    this.switchCaseLoad = this.switchCaseLoad.bind(this);
    this.showTermsAndConditions = this.showTermsAndConditions.bind(this);
    this.hideTermsAndConditions = this.hideTermsAndConditions.bind(this);
    this.clearMessage = this.clearMessage.bind(this);
    this.displayError = this.displayError.bind(this);
  }
  componentDidMount () {
    axios.interceptors.request.use((config) => {
      this.props.setErrorDispatch(null);
      return config;
    }, (error) => Promise.reject(error));
  }

  async onLogin (jwt, currentUser, history) {
    const caseloads = await axiosWrapper.get('/usercaseloads', {
      headers: { jwt }
    });
    currentUser.data.caseLoadOptions = caseloads.data;
    this.props.loginDetailsDispatch(jwt, currentUser.data);
    history.push('/home');
  }

  onFinishAllocation (history) {
    history.push('/home');
  }

  async switchCaseLoad (newCaseload) {
    try {
      await axiosWrapper.put('/setactivecaseload',
        { caseLoadId: newCaseload },
        {
          headers: {
            jwt: this.props.jwt
          }
        });
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

  displayError (error) {
    this.props.setErrorDispatch((error.response && error.response.data) || 'Something went wrong: ' + error);
  }

  render () {
    return (
      <Router>
        <div className="content">
          <Route render={(props) => <Header switchCaseLoad={this.switchCaseLoad} history={props.history} {...this.props} />}/>
          {!this.props.shouldShowTerms && <div className="inner-content">
            <div className="pure-g">
              <Route exact path="/" render={(props) => <LoginContainer onLogin={this.onLogin} {...props} />}/>
              <Route exact path="/home" render={() => <HomePage {...this.props} clearMessage={this.clearMessage}/>}/>
              <Route exact path="/keyworkerReports" render={() => <KeyworkerReports {...this.props} />}/>
              <Route exact path="/assignTransfer" render={() => <AssignTransferContainer initialSearch displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/unallocated" render={() => <AutoAllocateContainer displayError={this.displayError} onFinishAllocation={this.onFinishAllocation} {...this.props}/>}/>
              <Route exact path="/keyworker/search" render={() => <KeyworkerSearchContainer displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/keyworker/results" render={() => <KeyworkerSearchResultsContainer displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/keyworker/:staffId/profile" render={() => <KeyworkerProfileContainer displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/keyworker/:staffId/profile/edit" render={() => <KeyworkerProfileEditContainer displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/offender/results" render={() => <AssignTransferContainer displayError={this.displayError} {...this.props} />}/>
              <Route exact path="/offender/:offenderId/profile" render={() => <OffenderContainer displayError={this.displayError} {...this.props} />}/>
            </div>
          </div>}
          {this.props.shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          <Footer showTermsAndConditions={this.showTermsAndConditions}/>
        </div>
      </Router>);
  }
}

App.propTypes = {
  error: PropTypes.string,
  page: PropTypes.number,
  jwt: PropTypes.string,
  user: PropTypes.object,
  shouldShowTerms: PropTypes.bool,
  loginDetailsDispatch: PropTypes.func.isRequired,
  switchAgencyDispatch: PropTypes.func.isRequired,
  setTermsVisibilityDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    error: state.app.error,
    message: state.app.message,
    page: state.app.page,
    jwt: state.app.jwt,
    user: state.app.user,
    shouldShowTerms: state.app.shouldShowTerms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginDetailsDispatch: (jwt, user) => dispatch(setLoginDetails(jwt, user)),
    switchAgencyDispatch: (agencyId) => dispatch(switchAgency(agencyId)),
    setTermsVisibilityDispatch: (shouldShowTerms) => dispatch(setTermsVisibility(shouldShowTerms)),
    setErrorDispatch: (error) => dispatch(setError(error)),
    setMessageDispatch: (message) => dispatch(setMessage(message))
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export {
  App,
  AppContainer
};
export default App;
