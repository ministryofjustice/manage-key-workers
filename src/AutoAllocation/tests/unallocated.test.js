import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Unallocated from '../components/Unallocated';
import links from "../../links";

Enzyme.configure({ adapter: new Adapter() });

const list = [{
  bookingId: 1,
  lastName: "Rendell",
  firstName: "Steve",
  offenderNo: "ZZ124WX",
  assignedLivingUnitDesc: "L-1-1",
  confirmedReleaseDate: "2020-01-02",
  crsaClassification: "High"
},
{
  bookingId: 2,
  lastName: "Rendell2",
  firstName: "Steve2",
  offenderNo: "ZZ125WX",
  assignedLivingUnitDesc: "L-1-2",
  confirmedReleaseDate: null,
  crsaClassification: null
}];

describe('Unallocated component', () => {
  it('should render list correctly', () => {
    links.notmEndpointUrl = "http://my.testUrl/";
    const component = shallow(<Unallocated loaded unallocatedList={list} gotoNext={() => {}} />);

    expect(component).toMatchSnapshot();
  });

  it('should handle click correctly', async () => {
    let callBack = jest.fn();

    const component = shallow(<Unallocated loaded unallocatedList={[list]} gotoNext={callBack}/>);

    component.find('button').simulate('click');
    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should omit button and show message when no list 1', async () => {
    const component = shallow(<Unallocated loaded gotoNext={jest.fn()}/>);

    expect(component.find('button')).toHaveLength(0);
    expect(component.find('.font-small').debug()).toMatch('No prisoners found');
  });

  it('should omit button and show message when no list 2', async () => {
    const component = shallow(<Unallocated loaded unallocatedList={[]} gotoNext={jest.fn()}/>);

    expect(component.find('button')).toHaveLength(0);
    expect(component.find('.font-small').debug()).toMatch('No prisoners found');
  });
});
