import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allocationApp from './reducers';
import { applyMiddleware } from 'redux';

// Logger with default options
import logger from 'redux-logger';
const store = createStore(
  allocationApp,
  applyMiddleware(logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
