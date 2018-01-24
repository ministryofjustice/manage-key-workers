import React from 'react';
import Login from './Login';
import {
    BrowserRouter as Router,
    Route,
  } from 'react-router-dom';

export default () => 
 <Router>
    <div className="content">
      <div className="pure-g">
        <Route exact path="/" component={Login}/>
      </div>
    </div>
</Router>