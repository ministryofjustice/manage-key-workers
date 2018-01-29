import React from 'react';
import Login from './Login';
import HomePage from './HomePage';
import AllocateParent from './AllocateParent';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

class App extends React.Component {
  constructor () {
    super();
    this.onLogin = this.onLogin.bind(this);
    this.onAllocate = this.onAllocate.bind(this);
  }

  onLogin (jwt, history) {
    this.setState({ jwt });
    history.push('/unallocated');
  }

  onAllocate (history) {
    history.push('/autoallocate');
  }

  render () {
    return (<Router>
      <div className="content">
        <div className="pure-g">
          <Route exact path="/" render={(props) => <Login onLogin={this.onLogin} {...props} />}/>
          <Route exact path="/home" render={() => <HomePage jwt={this.state.jwt}/>}/>
          <Route exact path="/unallocated" render={(props) => <AllocateParent jwt={this.state.jwt} page={1} onAllocate={this.onAllocate} {...props}/>}/>
          <Route exact path="/autoallocate" render={(props) => <AllocateParent jwt={this.state.jwt} page={2} {...props}/>}/>
          <Route exact path="/keyworkerchanged" render={(props) => <AllocateParent jwt={this.state.jwt} page={3} {...props}/>}/>
        </div>
      </div>
    </Router>);
  }
}

export default App;
