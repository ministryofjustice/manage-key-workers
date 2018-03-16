import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerProfileEdit from "../components/KeyworkerProfileEdit";

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
  it('should render component correctly', async () => {
    const component = shallow(<KeyworkerProfileEdit keyworker={keyworker} handleSaveChanges={jest.fn()} handleStatusChange={jest.fn()} handleCapacityChange={jest.fn()} handleCancel={jest.fn()} />);
    expect(component.text()).toContain('Frank Butcher');
  });


  it('should handle save click correctly', async () => {
    let handleSave = jest.fn();

    const component = shallow(<KeyworkerProfileEdit keyworker={keyworker} handleSaveChanges={handleSave} handleStatusChange={jest.fn()} handleCapacityChange={jest.fn()} handleCancel={jest.fn()} />);

    component.find('#saveButton').simulate('click');
    expect(handleSave.mock.calls.length).toEqual(1);
  });

  it('should handle cancel click correctly', async () => {
    let handleCancel = jest.fn();

    const component = shallow(<KeyworkerProfileEdit keyworker={keyworker} handleSaveChanges={jest.fn()} handleStatusChange={jest.fn()} handleCapacityChange={jest.fn()} handleCancel={handleCancel} />);

    component.find('#cancelButton').simulate('click');
    expect(handleCancel.mock.calls.length).toEqual(1);
  });

  it('should render select with correct value', async () => {
    const component = shallow(<KeyworkerProfileEdit keyworker={keyworker} handleSaveChanges={jest.fn()} handleStatusChange={jest.fn()} handleCapacityChange={jest.fn()} handleCancel={jest.fn()} />);
    expect(component.find('#status-select').get(0).props.value).toEqual("INACTIVE");
  });
});

describe('KeyworkerProfileContainer component', () => {
  // todo
});
