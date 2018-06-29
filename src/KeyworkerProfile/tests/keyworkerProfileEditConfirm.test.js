import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerProfileEditConfirm from "../components/KeyworkerProfileEditConfirm";

Enzyme.configure({ adapter: new Adapter() });

const keyworker = {
  firstName: "Frank",
  lastName: "Butcher",
  staffId: 123,
  status: "INACTIVE",
  statusDescription: "Inactive",
  capacity: 8
};


describe('Keyworker Profile Edit component', () => {
  it('should render component correctly w with INACTIVE status', async () => {
    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={jest.fn()} handleCancel={jest.fn()} handleOptionChange={jest.fn()} status="INACTIVE"/>);
    expect(component.text()).toContain('This will remove the key worker from the auto-allocation pool and release all of their allocated prisoners.');
    expect(component.find('input').length).toEqual(0); //no options shown
    expect(component.find('#keyworker-status').hasClass('inactiveStatus')).toBe(true);
    expect(component.find('DatePickerInput').length).toEqual(0);
    expect(component.find('#back_link').length).toEqual(1);
  });

  it('should render component correctly with UNAVAILABLE_ANNUAL_LEAVE status', async () => {
    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={jest.fn()} handleCancel={jest.fn()} handleOptionChange={jest.fn()} status="UNAVAILABLE_ANNUAL_LEAVE"/>);
    console.log("debug output " + component.debug());
    expect(component.text()).toContain('Choose an option');
    expect(component.find('input').length).toEqual(3);
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true);
    expect(component.find('DatePickerInput').length).toEqual(1);
  });

  it('should render component correctly with UNAVAILABLE_LONG_TERM_ABSENCE status', async () => {
    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={jest.fn()} handleCancel={jest.fn()} handleOptionChange={jest.fn()} status="UNAVAILABLE_LONG_TERM_ABSENCE"/>);
    console.log("debug output " + component.debug());
    expect(component.text()).toContain('Choose an option');
    expect(component.find('input').length).toEqual(3);
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true);
    expect(component.find('DatePickerInput').length).toEqual(0);
  });

  it('should render component correctly with UNAVAILABLE_NO_PRISONER_CONTACT status', async () => {
    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={jest.fn()} handleCancel={jest.fn()} handleOptionChange={jest.fn()} status="UNAVAILABLE_NO_PRISONER_CONTACT"/>);
    console.log("debug output " + component.debug());
    expect(component.text()).toContain('Choose an option');
    expect(component.find('input').length).toEqual(3);
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true);
    expect(component.find('DatePickerInput').length).toEqual(0);
  });


  it('should handle save click correctly', async () => {
    let handleSave = jest.fn();

    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={handleSave} handleCancel={jest.fn()} handleOptionChange={jest.fn()} />);

    component.find('.button-save').simulate('click');
    expect(handleSave.mock.calls.length).toEqual(1);
  });

  it('should handle cancel click correctly', async () => {
    let handleCancel = jest.fn();

    const component = shallow(<KeyworkerProfileEditConfirm keyworker={keyworker} handleSaveChanges={jest.fn()} handleCancel={handleCancel} handleOptionChange={jest.fn()} />);

    component.find('.button-cancel').simulate('click');
    expect(handleCancel.mock.calls.length).toEqual(1);
  });
});

