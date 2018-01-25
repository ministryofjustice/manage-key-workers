import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';
import Login from './Login';

let mock = new MockAdaptor(axios);
Enzyme.configure({ adapter: new Adapter() });

describe('Login component',() => {
    it('should show relevent message when an error has occurred ', (done) => {
       const error = 'could not login';
       mock.onPost('/login').reply(403, error);

       const component = shallow(<Login/>); 
       
       component.instance().componentDidMount();

       setTimeout(() => {
           done();
           expect(component.contains(<div>{error}</div>)).toBe(true);
        },1);
    });
});