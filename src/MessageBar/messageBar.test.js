import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MessageBar from "../MessageBar";

Enzyme.configure({ adapter: new Adapter() });


describe('ManualAllocation component', () => {
  it('should render message correctly', async () => {
    const component = shallow(<MessageBar message="Hello!" clearMessage={jest.fn()}/>);
    expect(component.find('div').at(1).text()).toEqual('Hello!');
  });

  it('should clear message after displayTime expires', async (done) => {
    const clearMessageMock = jest.fn();
    shallow(<MessageBar message="Hello!" displayTime={100} clearMessage={clearMessageMock}/>);
    setTimeout(function () {
      expect(clearMessageMock.mock.calls.length).toBe(1);
      done();
    }, 200);
  });

  it('should not render message bar if no message provided', async () => {
    const component = shallow(<MessageBar message="" clearMessage={jest.fn()}/>);
    expect(component.find('div').exists()).toEqual(false);
  });
});
