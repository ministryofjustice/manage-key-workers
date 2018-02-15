import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { AppContainer } from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allocationApp from './reducers';
import { applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';

// Logger with default options
import logger from 'redux-logger';
const store = createStore(
  allocationApp,
  applyMiddleware(logger)
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer/>
  </Provider>,
  document.getElementById('root')
);
