import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import KeyworkerProfile from "../components/KeyworkerProfile";

Enzyme.configure({ adapter: new Adapter() });

const NO_DATA = '--';
const OFFENDER_NAME_COLUMN = 0;
const NOMS_ID_COLUMN = 1;
const LOCATION_COLUMN = 2;
const CRD_COLUMN = 3;
const CSRA_COLUMN = 4;
const KEYWORKER_SELECT_COLUMN = 5;

const keyworkerList = [
  {
    firstName: "Frank",
    lastName: "Butcher",
    staffId: 123
  },
  {
    firstName: "David",
    lastName: "Loo",
    staffId: 123
  }]
;

const keyworker = {
  firstName: "Frank",
  lastName: "Butcher",
  staffId: 123,
  status: "INACTIVE",
  statusDescription: "Inactive",
  capacity: 8
};

const allocatedOffenders = [{
  bookingId: 1,
  lastName: "Rendell",
  firstName: "Steve",
  offenderNo: "ZZ124WX",
  internalLocationDesc: "L-1-1",
  confirmedReleaseDate: "20/10/2019",
  crsaClassification: "Standard",
  keyworkerDisplay: "Hanson, Sam",
  numberAllocated: 4,
  staffId: 123
},
{
  bookingId: 2,
  lastName: "Rendell2",
  firstName: "Steve2",
  offenderNo: "ZZ125WX",
  internalLocationDesc: "L-1-2",
  confirmedReleaseDate: "20/10/2019",
  crsaClassification: "High",
  keyworkerDisplay: NO_DATA,
  staffId: 999
},
{
  bookingId: 3,
  lastName: "Bennett",
  firstName: "Lucinda",
  offenderNo: "ZB125WX",
  internalLocationDesc: "L-2-2",
  confirmedReleaseDate: "20/10/2019",
  crsaClassification: NO_DATA,
  keyworkerDisplay: "Hanson, Sam",
  numberAllocated: 5,
  staffId: 123
}];

describe('Keyworker Profile component', () => {
  it('should render component correctly', async () => {
    const component = shallow(<KeyworkerProfile keyworkerAllocations={allocatedOffenders} keyworkerChangeList={[]} keyworkerList={keyworkerList} keyworker={keyworker} handleKeyworkerChange={jest.fn()} handleAllocationChange={jest.fn()} handleEditProfileClick={jest.fn()}/>);
    console.log(component.debug());
    expect(component.text()).toContain('Profile for Frank Butcher');
    expect(component.find('#keyworker-status').at(0).prop('className')).toContain('inactiveStatus');
    expect(component.find('tr').length).toEqual(4); // includes header tr
    expect(component.find('tr').at(3).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Bennett, Lucinda');
    expect(component.find('tr').at(3).find('td').at(NOMS_ID_COLUMN).text()).toEqual('ZB125WX');
    expect(component.find('tr').at(3).find('td').at(LOCATION_COLUMN).text()).toEqual('L-2-2');
    expect(component.find('tr').at(3).find('td').at(CRD_COLUMN).text()).toEqual('20/10/2019');
    expect(component.find('tr').at(3).find('td').at(CSRA_COLUMN).text()).toEqual(NO_DATA);
    expect(component.find('#updateAllocationButton').length).toEqual(1);
  });

  it('should hide save button if no allocations', async () => {
    const component = shallow(<KeyworkerProfile keyworkerAllocations={[]} keyworkerChangeList={[]} keyworkerList={keyworkerList} keyworker={keyworker} handleKeyworkerChange={jest.fn()} handleAllocationChange={jest.fn()} handleEditProfileClick={jest.fn()}/>);
    console.log(component.debug());
    expect(component.text()).toContain('Profile for Frank Butcher');
    expect(component.find('#updateAllocationButton').length).toEqual(0);
  });

  it('should remove keyworker from select if currently allocated', async () => {
    const component = shallow(<KeyworkerProfile keyworkerAllocations={allocatedOffenders} keyworkerChangeList={[]} keyworkerList={keyworkerList} keyworker={keyworker} handleKeyworkerChange={() => {}} handleAllocationChange={() => {}} handleEditProfileClick={jest.fn()}/>);
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_SELECT_COLUMN).find('option').length).toEqual(1);
  });

  it('should handle click correctly', async () => {
    let postKeyworkerChange = jest.fn();

    const component = shallow(<KeyworkerProfile keyworkerAllocations={allocatedOffenders} keyworkerChangeList={[]} keyworkerList={keyworkerList} keyworker={keyworker} handleKeyworkerChange={jest.fn()} handleAllocationChange={postKeyworkerChange} handleEditProfileClick={jest.fn()}/>);

    component.find('#updateAllocationButton').simulate('click');
    expect(postKeyworkerChange.mock.calls.length).toEqual(1);
  });

  it('should handle edit profile click correctly', async () => {
    let handleButtonClick = jest.fn();

    const component = shallow(<KeyworkerProfile keyworkerAllocations={allocatedOffenders} keyworkerChangeList={[]} keyworkerList={keyworkerList} keyworker={keyworker} handleKeyworkerChange={jest.fn()} handleAllocationChange={jest.fn()} handleEditProfileClick={handleButtonClick}/>);

    component.find('#editProfileButton').simulate('click');
    expect(handleButtonClick.mock.calls.length).toEqual(1);
  });
});

describe('KeyworkerProfileContainer component', () => {
  // todo
});
