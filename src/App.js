import React from 'react';
import Login from './Login';
import HomePage from './HomePage';
import { AllocateParentContainer } from './AllocateParent';
import Header from './Header/index';
import Footer from './Footer/index';
import Terms from './Footer/terms-and-conditions';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import axiosWrapper from "./backendWrapper";

class App extends React.Component {
  constructor () {
    super();
    this.onLogin = this.onLogin.bind(this);
    this.onFinishAllocation = this.onFinishAllocation.bind(this);
    this.switchCaseLoad = this.switchCaseLoad.bind(this);
    this.showTermsAndConditions = this.showTermsAndConditions.bind(this);
    this.hideTermsAndConditions = this.hideTermsAndConditions.bind(this);
    this.state = {
      agencyId: "",
      user: null,
      shouldShowTerms: false
    };
  }

  async onLogin (jwt, currentUser, history) {
    const caseloads = await axiosWrapper.get('/usercaseloads', {
      headers: {
        jwt: jwt
      }
    });
    currentUser.data.caseLoadOptions = caseloads.data;
    this.setState({
      jwt: jwt,
      agencyId: currentUser.data.activeCaseLoadId,
      user: currentUser.data
    });
    history.push('/unallocated');
  }

  onFinishAllocation (history) {
    history.push('/home');
  }

  async switchCaseLoad (newCaseload) {
    const currentUserData = this.state.user;
    currentUserData.activeCaseLoadId = newCaseload;
    try {
      await axiosWrapper.put('/setactivecaseload',
        { caseLoadId: newCaseload },
        {
          headers: {
            jwt: this.state.jwt
          }
        });
      this.setState({
        jwt: this.state.jwt,
        agencyId: newCaseload,
        user: currentUserData
      });
    } catch (error) {
      console.error(error);
    }
  }

  showTermsAndConditions () {
    this.setState({
      ...this.state,
      shouldShowTerms: true
    });
  }

  hideTermsAndConditions () {
    this.setState({
      ...this.state,
      shouldShowTerms: false
    });
  }

  render () {
    return (
      <Router>
        <div>
          <Route render={(props) => (
            <Header user={this.state.user} switchCaseLoad={this.switchCaseLoad} {...props} />
          )} />
          {!this.state.shouldShowTerms && <div className="content">
            <div className="pure-g">
              <Route exact path="/" render={(props) => <Login onLogin={this.onLogin} {...props} />}/>
              <Route exact path="/home" render={() => <HomePage jwt={this.state.jwt} message="key workers successfully updated"/>}/>
              <Route exact path="/unallocated" render={(props) => <AllocateParentContainer jwt={this.state.jwt} agencyId={this.state.agencyId} onFinishAllocation={this.onFinishAllocation} {...props}/>}/>
            </div>
          </div>}
          {this.state.shouldShowTerms && <Terms close={() => this.hideTermsAndConditions()} />}
          <Footer showTermsAndConditions={this.showTermsAndConditions}/>
        </div>
      </Router>);
  }
}

export default App;
