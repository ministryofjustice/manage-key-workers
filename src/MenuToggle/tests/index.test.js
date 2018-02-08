import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MenuToggle from '../index';
import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
Enzyme.configure({ adapter: new Adapter() });

describe('MenuToggle', () => {
  it('should initialise correctly when no attributes defined', () => {
    const wrapped = mount(<MenuToggle />);
    const elem = wrapped.find('#nav-icon').getElement();

    expect(elem).not.toBe(undefined);

    expect(elem.props.className).toBe('');
  });

  it('should initialise with correct className when toggleState set true', () => {
    const wrapped = mount(<MenuToggle toggleState />);
    const elem = wrapped.find('#nav-icon').getElement();

    expect(elem).not.toBe(undefined);

    expect(elem.props.className).toBe('open');
  });

  it('should call specified onToggle funtion when clicked', () => {
    const onToggle = jest.fn();
    const wrapped = shallow(<MenuToggle onToggle={onToggle} />);
    const button = wrapped.find('#nav-icon');

    button.simulate('click');

    expect(onToggle).toBeCalled();
  });
});
