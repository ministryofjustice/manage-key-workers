import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';
import Login from './Login';
import jsdom from 'jsdom'
import { setTimeout } from 'timers';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
let mock = new MockAdaptor(axios);
Enzyme.configure({adapter: new Adapter()});


describe('Login component', () => {

  it('should call onLogin with correct parameters on a successful login',async () => {

    const jwt = '1234';

    mock.onPost('/login').reply(200,{},{
      jwt
    });

    let onLoginCallBack = jest.fn();
    const historyCallBack = () => {};

    const component = shallow(<Login onLogin={onLoginCallBack} history={historyCallBack} />);

    await component.instance().handleSubmit({
      preventDefault: () => {},
    });

    expect(onLoginCallBack.mock.calls[0][0]).toBe(jwt);
    expect(onLoginCallBack.mock.calls[0][1]).toBe(historyCallBack);
  });

  it('should show relevant message when an error has occurred ', () => {
    const error = 'could not login';
    mock.onPost('/login').reply(
      (input) => {
        // TODO  expect(input.username).toBe("user1");
        // TODO  expect(input.password).toBe("password1");
        const output = [403, error];
        return output;
      });

    const component = mount(<Login onLogin={() => {}} history={() => {}}/>);

    const button = component.find('button');
    console.log(button);

    component.find('button').simulate('submit');
  });
});