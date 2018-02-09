import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Unallocated from './Unallocated';

Enzyme.configure({ adapter: new Adapter() });

describe('Unallocated component', () => {
  it('should render list correctly', () => {
    const list = [{
      bookingId: 1,
      lastName: "Rendell",
      firstName: "Steve",
      offenderNo: "ZZ124WX",
      internalLocationDesc: "L-1-1",
      confirmedReleaseDate: "2020-01-02",
      crsaClassification: "High"
    },
    {
      bookingId: 2,
      lastName: "Rendell2",
      firstName: "Steve2",
      offenderNo: "ZZ125WX",
      internalLocationDesc: "L-1-2",
      confirmedReleaseDate: null,
      crsaClassification: null
    }];

    const component = shallow(<Unallocated list={list} />);

    expect(component).toMatchSnapshot();
  });

  it('should handle click correctly', async () => {
    let callBack = jest.fn();

    const component = shallow(<Unallocated list={[]} gotoNext={callBack}/>);

    component.find('button').simulate('click');
    expect(callBack.mock.calls.length).toEqual(1);
  });
});
