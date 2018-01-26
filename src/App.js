import React from 'react';

import Login from './Login';
import HomePage from './HomePage';
import Unallocated from './Unallocated';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

class App extends React.Component {
  constructor () {
    super();
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin (jwt, history) {
    this.setState({ jwt });
    history.push('/unallocated');
  }

  render () {
    return (<Router>
      <div className="content">
        <div className="pure-g">
          <Route exact path="/" render={(props) => <Login onLogin={this.onLogin} {...props} />}/>
          <Route exact path="/home" render={() => <HomePage jwt={this.state.jwt}/>}/>
          <Route exact path="/unallocated" render={() => <Unallocated jwt={this.state.jwt}/>}/>
        </div>
      </div>
    </Router>);
  }
}

export default App;
