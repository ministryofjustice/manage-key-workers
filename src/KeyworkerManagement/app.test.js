import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from "./App";

jest.mock('../Spinner/index', () => '');

Enzyme.configure({ adapter: new Adapter() });


describe('App component', () => {
  it('should handle session timeout error response and display alert', async () => {
    const component = shallow(<App
      switchCaseLoad ={jest.fn()}
      config = {{}}
      user={{}}
      history={{ push: jest.fn() }}
      setErrorDispatch={jest.fn()}
      userDetailsDispatch={jest.fn()}
      switchAgencyDispatch={jest.fn()}
      configDispatch={jest.fn()}
      setMessageDispatch={jest.fn()}
      setMenuOpen={jest.fn()}
      setTermsVisibilityDispatch={jest.fn()}/>
    );
    const appInstance = component.instance();
    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({ response: { status: 401, data: { message: "Session expired", reason: "session-expired" } } });
    expect(component.instance().displayAlertAndLogout).toBeCalledWith('Your session has expired, please click OK to be redirected back to the login page');

    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({ response: { status: 401, data: { message: "another 401" } } });
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();

    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({ response: { status: 400 } });
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();

    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({});
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();
  });

  it('should handle non-session timout error responses without the session timeout alert', async () => {
    const component = shallow(<App
      switchCaseLoad ={jest.fn()}
      config = {{}}
      user={{}}
      history={{ push: jest.fn() }}
      setErrorDispatch={jest.fn()}
      userDetailsDispatch={jest.fn()}
      switchAgencyDispatch={jest.fn()}
      configDispatch={jest.fn()}
      setMessageDispatch={jest.fn()}
      setMenuOpen={jest.fn()}
      setTermsVisibilityDispatch={jest.fn()}/>
    );
    const appInstance = component.instance();
    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({ response: { status: 401, data: { message: "another 401" } } });
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();

    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({ response: { status: 400 } });
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();

    appInstance.displayAlertAndLogout = jest.fn();
    appInstance.handleError({});
    expect(component.instance().displayAlertAndLogout).not.toBeCalled();
  });

  it('should close the menu when the content is clicked', () => {
    const setMenuOpen = jest.fn();

    const component = shallow(<App
      switchCaseLoad ={jest.fn()}
      history={jest.fn()}
      config = {{}}
      user={{}}
      setErrorDispatch={jest.fn()}
      userDetailsDispatch={jest.fn()}
      switchAgencyDispatch={jest.fn()}
      configDispatch={jest.fn()}
      setMessageDispatch={jest.fn()}
      menuOpen
      setMenuOpen={setMenuOpen}
      setTermsVisibilityDispatch={jest.fn()}/>);

    component.find('.inner-content').simulate('click');

    expect(setMenuOpen).toHaveBeenCalledWith(false);
  });
});
