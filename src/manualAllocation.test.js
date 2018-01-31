import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ManualAllocation from "./ManualAllocation";

Enzyme.configure({ adapter: new Adapter() });

describe('ManualAllocation component', () => {
  it('should render list correctly', async () => {
    const list = [{
      bookingId: 1,
      lastName: "Rendell",
      firstName: "Steve",
      offenderNo: "ZZ124WX",
      internalLocationDesc: "L-1-1"
    },
    {
      bookingId: 2,
      lastName: "Rendell2",
      firstName: "Steve2",
      offenderNo: "ZZ125WX",
      internalLocationDesc: "L-1-2"
    }];

    const component = shallow(<ManualAllocation list={list} />);

    expect(component).toMatchSnapshot();
  });

  it('should handle click correctly', async () => {
    let callBack = jest.fn();

    const component = shallow(<ManualAllocation list={[]} gotoNext={callBack}/>);

    component.find('button').simulate('click');
    expect(callBack.mock.calls.length).toEqual(1);
  });
});
