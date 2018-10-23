import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import allocationApp from './redux/reducers'

// Logger with default options
import { AppContainer } from './KeyworkerManagement/App'

const store = createStore(allocationApp, applyMiddleware(logger))

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
