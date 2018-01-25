import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';
import Login from './Login';
import jsdom from 'jsdom'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView
let mock = new MockAdaptor(axios);
Enzyme.configure({ adapter: new Adapter() });


describe('Login component',() => {
    it('should show relevent message when an error has occurred ', (done) => {
       const error = 'could not login';
       mock.onPost('/login').reply(403, error);

       const component = mount(<Login/>);

       const button = component.find('button');
       console.error(button);
       
       component.find('button').simulate('submit');

       expect(component.contains(<div> {error} </div>)).toBe(true);
    });
});