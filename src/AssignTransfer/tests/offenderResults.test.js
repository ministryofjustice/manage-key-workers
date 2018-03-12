import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { OffenderResults } from "../components/OffenderResults";

Enzyme.configure({ adapter: new Adapter() });

const OFFENDER_NAME_COLUMN = 0;
const NOMS_ID_COLUMN = 1;
const LOCATION_COLUMN = 2;
const CRD_COLUMN = 3;
const CSRA_COLUMN = 4;
const KEYWORKER_NAME_COLUMN = 5;
const KEYWORKER_SELECT_COLUMN = 6;

const housingLocations = [{ id: 123, description: "block 1" }, { id: 223, description: "block 2" }];

const offenderResults = [{
  bookingId: 1,
  lastName: "Rendell",
  firstName: "Steve",
  offenderNo: "ZZ124WX",
  assignedLivingUnitDesc: "L-1-1",
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
  assignedLivingUnitDesc: "L-1-2",
  confirmedReleaseDate: "20/10/2019",
  crsaClassification: null,
  keyworkerDisplay: null,
  staffId: 999
},
{
  bookingId: 3,
  lastName: "Bennett",
  firstName: "Lucinda",
  offenderNo: "ZB125WX",
  assignedLivingUnitDesc: "L-2-2",
  // missing confirmedReleaseDate: "20/10/2019",
  // missing crsaClassification: NO_DATA,
  keyworkerDisplay: "Hanson, Sam",
  numberAllocated: 5,
  staffId: 123
}];

const keyworkerList = [{
  staffId: 123,
  firstName: 'Amy',
  lastName: 'Hanson',
  numberAllocated: 4
},
{
  staffId: 124,
  firstName: 'Sam',
  lastName: 'Hanson',
  numberAllocated: 6
}];

describe('Offender results component', () => {
  it('should render initial offender results form correctly', async () => {
    const component = shallow(<OffenderResults
      keyworkerList={keyworkerList}
      offenderResults={offenderResults}
      allocatedKeyworkers={[]}
      history={{}}
      postManualOverride={jest.fn()}
      handleKeyworkerChange={jest.fn()}/>
    );
    expect(component.find('tr').length).toEqual(4); // 3 plus table header tr
    expect(component.find('tr').at(1).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Rendell, Steve');
    expect(component.find('tr').at(1).find('td').at(NOMS_ID_COLUMN).text()).toEqual('ZZ124WX');
    expect(component.find('tr').at(1).find('td').at(LOCATION_COLUMN).text()).toEqual('L-1-1');
    expect(component.find('tr').at(1).find('td').at(CRD_COLUMN).text()).toEqual('20/10/2019');
    expect(component.find('tr').at(1).find('td').at(CSRA_COLUMN).text()).toEqual('Standard');
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_NAME_COLUMN).text()).toContain("Hanson, Sam");
    expect(component.find('tr').at(2).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Rendell2, Steve2');
    expect(component.find('tr').at(2).find('td').at(CSRA_COLUMN).text()).toEqual('--');
    expect(component.find('tr').at(3).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Bennett, Lucinda');
    expect(component.find('tr').at(3).find('td').at(CRD_COLUMN).text()).toEqual('--');
    expect(component.find('tr').at(3).find('td').at(CSRA_COLUMN).text()).toEqual('--');
  });

  it('should handle submit form correctly', async () => {
    const postManualOverride = jest.fn();
    const component = shallow(<OffenderResults
      postManualOverride={postManualOverride}
      history ={{ push: jest.fn() }}
      handleKeyworkerChange={jest.fn()}/>);

    component.find('button').simulate('click');
    expect(postManualOverride).toHaveBeenCalled();
  });
});
