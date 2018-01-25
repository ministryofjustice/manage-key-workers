import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';

let mock = new MockAdaptor(axios);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
