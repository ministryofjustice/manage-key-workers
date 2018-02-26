import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ManualAllocation from "./index";

Enzyme.configure({ adapter: new Adapter() });

const NO_DATA = '--';
const OFFENDER_NAME_COLUMN = 0;
const NOMS_ID_COLUMN = 1;
const LOCATION_COLUMN = 2;
const CRD_COLUMN = 3;
const CSRA_COLUMN = 4;
const KEYWORKER_NAME_COLUMN = 5;
const KEYWORKER_SELECT_COLUMN = 6;

const allocatedList = [{
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

const keyworkList = [{
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


describe('ManualAllocation component', () => {
  it('should render list correctly', async () => {
    const component = shallow(<ManualAllocation allocatedKeyworkers={[]} allocatedList={allocatedList} keyworkerList={keyworkList} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);

    expect(component.find('tr').length).toEqual(4); // includes table header tr
    expect(component.find('tr').at(1).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Rendell, Steve');
    expect(component.find('tr').at(1).find('td').at(NOMS_ID_COLUMN).text()).toEqual('ZZ124WX');
    expect(component.find('tr').at(1).find('td').at(LOCATION_COLUMN).text()).toEqual('L-1-1');
    expect(component.find('tr').at(1).find('td').at(CRD_COLUMN).text()).toEqual('20/10/2019');
    expect(component.find('tr').at(1).find('td').at(CSRA_COLUMN).text()).toEqual('Standard');
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_NAME_COLUMN).text()).toContain("Hanson, Sam");
  });

  it('should remove keyworker from select if currently allocated', async () => {
    const component = shallow(<ManualAllocation allocatedKeyworkers={[]} allocatedList={allocatedList} keyworkerList={keyworkList} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_SELECT_COLUMN).find('option').length).toEqual(2);
  });

  it('should handle click correctly', async () => {
    let postOverrideCallBack = jest.fn();
    let keyworkerChangeCallback = jest.fn();

    const component = shallow(<ManualAllocation allocatedKeyworkers={[]} allocatedList={[]} keyworkerList={[]} handleKeyworkerChange={keyworkerChangeCallback} postManualOverride={postOverrideCallBack} applyDateFilter={() => {}} />);

    component.find('button').simulate('click');
    expect(postOverrideCallBack.mock.calls.length).toEqual(1);
  });

  it('should display tooltip if keyworker details available', async () => {
    const component = shallow(<ManualAllocation allocatedKeyworkers={[]} allocatedList={allocatedList} keyworkerList={keyworkList} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);
    expect(component.find('tr').at(1).find('td').at(5).find('span[data-tip=\'4 allocated\']').exists()).toEqual(true);
  });

  it('should not display tooltip if keyworker details unavailable', async () => {
    const component = shallow(<ManualAllocation allocatedKeyworkers={[]} allocatedList={allocatedList} keyworkerList={keyworkList} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);
    expect(component.find('tr').at(2).find('td').at(5).find('span[data-tip]').exists()).toEqual(false);
  });

  it('should display date filter if toggled on', async () => {
    const component = shallow(<ManualAllocation displayDateFilter allocatedList={[]} keyworkerList={[]} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);
    expect(component.find('DateFilter').exists()).toEqual(true);
  });

  it('should not display date filter if toggled off', async () => {
    const component = shallow(<ManualAllocation allocatedList={[]} keyworkerList={[]} handleKeyworkerChange={() => {}} postManualOverride={() => {}} applyDateFilter={() => {}} />);
    expect(component.find('DateFilter').exists()).toEqual(false);
  });
});
