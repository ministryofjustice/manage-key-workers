import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdaptor from 'axios-mock-adapter';
import AllocateParent from "./AllocateParent";

let mock = new MockAdaptor(axios);
Enzyme.configure({ adapter: new Adapter() });
let calledUnallocated = false;
let calledAllocated = false;

const setupMocks = () => {
  mock.reset();
  mock.onGet('/unallocated').reply(
    (input) => {
      expect(input.headers.jwt).toBe('dummy-jwt');
      calledUnallocated = true;
      return [200, ["s1", "s2"], {}];
    });
  mock.onGet('/allocated').reply(
    (input) => {
      expect(input.headers.jwt).toBe('dummy-jwt');
      calledAllocated = true;
      return [200, ["s3", "s4"], {}];
    });
  // 3rd screen mock TODO
};

describe('AllocateParent component', () => {
  it('should render page 1 correctly', async () => {
    setupMocks();
    expect.assertions(3);

    const component = await shallow(<AllocateParent jwt={"dummy-jwt"}/>);

    await expect(calledUnallocated).toBe(true);
    await expect(calledAllocated).toBe(false);
  });

  it('should render page 2 correctly', async () => {
    setupMocks();
    expect.assertions(4);
    let onFinishAllocation = jest.fn();

    const component = await shallow(<AllocateParent jwt={"dummy-jwt"} onFinishAllocation={onFinishAllocation}/>);
    // Simulate clicking to 2nd page
    component.instance().gotoManualAllocation();

    await expect(calledUnallocated).toBe(true);
    await expect(calledAllocated).toBe(true);
  });

  // page 3 TODO

  it('should render a middle tier error on page 1 correctly', (done) => {
    mock.reset();
    mock.onGet('/unallocated').reply([500, "test error"]);

    const component = shallow(<AllocateParent jwt={"dummy-jwt"}/>);

    setTimeout(() => {
      component.update();
      // const s = component.debug();
      expect(component.contains("Something went wrong: Error: Request failed with status code 500,test error")).toBe(true);
      done();
    }, 5);
  });

  it('should render a middle tier error on page 2 correctly', (done) => {
    mock.reset();
    mock.onGet('/unallocated').reply([200, ["s1", "s2"], {}]);
    mock.onGet('/allocated').reply([500, "test error"]);

    const component = shallow(<AllocateParent jwt={"dummy-jwt"}/>);
    // Simulate clicking to 2nd page
    component.instance().gotoManualAllocation();

    setTimeout(() => {
      component.update();
      expect(component.contains("Something went wrong: Error: Request failed with status code 500,test error")).toBe(true);
      done();
    }, 5);
  });

  // TODO page 3
});
