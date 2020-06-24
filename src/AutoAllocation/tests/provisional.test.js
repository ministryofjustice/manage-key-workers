import React from 'react'
import { shallow } from 'enzyme'
import { Provisional } from '../components/Provisional'
import mockHistory from '../../test/mockHistory'

const NO_DATA = '--'
const OFFENDER_NAME_COLUMN = 0
const NOMS_ID_COLUMN = 1
const LOCATION_COLUMN = 2
const CRD_COLUMN = 3
const CSRA_COLUMN = 4
const KEYWORKER_NAME_COLUMN = 5
const KEYWORKER_SELECT_COLUMN = 6

const allocatedList = [
  {
    bookingId: 1,
    lastName: 'Rendell',
    firstName: 'Steve',
    offenderNo: 'ZZ124WX',
    internalLocationDesc: 'L-1-1',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'Standard',
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 4,
    staffId: 123,
    agencyId: 'TEST',
    allocationType: '',
    assigned: '',
    deallocOnly: false,
    prisonId: 'Prison',
  },
  {
    bookingId: 2,
    lastName: 'Rendell2',
    firstName: 'Steve2',
    offenderNo: 'ZZ125WX',
    internalLocationDesc: 'L-1-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'High',
    keyworkerDisplay: NO_DATA,
    staffId: 999,
    agencyId: 'TEST',
    allocationType: '',
    assigned: '',
    deallocOnly: false,
    numberAllocated: 5,
    prisonId: 'Prison',
  },
  {
    bookingId: 3,
    lastName: 'Bennett',
    firstName: 'Lucinda',
    offenderNo: 'ZB125WX',
    internalLocationDesc: 'L-2-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: NO_DATA,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 5,
    staffId: 123,
    agencyId: 'TEST',
    allocationType: '',
    assigned: '',
    deallocOnly: false,
    prisonId: 'Prison',
  },
]

const allocatedLongList = new Array(20).fill({}).map((a, i) => ({
  ...a,
  bookingId: i,
  offenderNo: `ABC${i}`,
  lastName: 'Bennett',
  firstName: 'Lucinda',
  internalLocationDesc: 'L-2-2',
  confirmedReleaseDate: '2019-10-20',
  crsaClassification: NO_DATA,
  keyworkerDisplay: 'Hanson, Sam',
  numberAllocated: 5,
  staffId: 123 + i,
  agencyId: 'TEST',
  allocationType: '',
  assigned: '',
  deallocOnly: false,
  prisonId: 'Prison',
}))

const keyworkList = [
  {
    staffId: 123,
    firstName: 'Amy',
    lastName: 'Hanson',
    numberAllocated: 4,
    agencyId: 'TEST',
    autoAllocationAllowed: false,
    capacity: 10,
    status: 'Active',
  },
  {
    staffId: 124,
    firstName: 'Sam',
    lastName: 'Hanson',
    numberAllocated: 6,
    agencyId: 'TEST',
    autoAllocationAllowed: false,
    capacity: 10,
    status: 'Active',
  },
]

describe('ManualAllocation component', () => {
  it('should render list correctly', async () => {
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={keyworkList}
        handleKeyworkerChange={() => {}}
        postManualOverride={() => {}}
        onFinishAllocation={() => {}}
        history={mockHistory}
      />
    )

    expect(component.find('tr').length).toEqual(4) // includes table header tr
    expect(component.find('tr').at(1).find('td').at(OFFENDER_NAME_COLUMN).text()).toEqual('Rendell, Steve')
    expect(component.find('tr').at(1).find('td').at(NOMS_ID_COLUMN).text()).toEqual('ZZ124WX')
    expect(component.find('tr').at(1).find('td').at(LOCATION_COLUMN).text()).toEqual('L-1-1')
    expect(component.find('tr').at(1).find('td').at(CRD_COLUMN).text()).toEqual('20/10/2019')
    expect(component.find('tr').at(1).find('td').at(CSRA_COLUMN).text()).toEqual('Standard')
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_NAME_COLUMN).text()).toContain('Hanson, Sam')
    expect(component.find('.button-save').length).toEqual(1)
    expect(component.find('.button-cancel').length).toEqual(1)
  })

  it('should duplicate buttons when list is long', async () => {
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedLongList}
        keyworkerList={keyworkList}
        handleKeyworkerChange={() => {}}
        postManualOverride={() => {}}
        onFinishAllocation={() => {}}
        history={mockHistory}
      />
    )

    expect(component.find('tr').length).toEqual(21) // includes table header tr
    expect(component.find('.button-save').length).toEqual(2)
    expect(component.find('.button-cancel').length).toEqual(2)
  })

  it('should remove keyworker from select if currently allocated', async () => {
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={keyworkList}
        handleKeyworkerChange={() => {}}
        postManualOverride={() => {}}
        onFinishAllocation={() => {}}
        history={mockHistory}
      />
    )
    expect(component.find('tr').at(1).find('td').at(KEYWORKER_SELECT_COLUMN).find('option').length).toEqual(2)
  })

  it('should handle submit click correctly', async () => {
    const postOverrideCallBack = jest.fn()
    const cancelCallBack = jest.fn()
    const keyworkerChangeCallback = jest.fn()

    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={[]}
        onFinishAllocation={cancelCallBack}
        handleKeyworkerChange={keyworkerChangeCallback}
        postManualOverride={postOverrideCallBack}
        applyDateFilter={() => {}}
        history={mockHistory}
      />
    )

    component.find('.button-save').simulate('click')
    expect(postOverrideCallBack.mock.calls.length).toEqual(1)
    expect(cancelCallBack).not.toHaveBeenCalled()
  })

  it('should handle cancel click correctly', async () => {
    const postOverrideCallBack = jest.fn()
    const cancelCallBack = jest.fn()
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={[]}
        handleKeyworkerChange={jest.fn()}
        onFinishAllocation={cancelCallBack}
        postManualOverride={postOverrideCallBack}
        applyDateFilter={() => {}}
        history={mockHistory}
      />
    )

    component.find('.button-cancel').simulate('click')
    expect(cancelCallBack.mock.calls.length).toEqual(1)
    expect(postOverrideCallBack).not.toHaveBeenCalled()
  })

  it('should display allocations if keyworker details available', async () => {
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={keyworkList}
        onFinishAllocation={() => {}}
        handleKeyworkerChange={() => {}}
        postManualOverride={() => {}}
        applyDateFilter={() => {}}
        history={mockHistory}
      />
    )
    expect(component.find('tr').at(1).find('td').at(5).text()).toMatch(/Hanson, Sam \(4\)/)
  })

  it('should not display allocations if keyworker details unavailable', async () => {
    const component = shallow(
      <Provisional
        allocatedKeyworkers={[]}
        allocatedList={allocatedList}
        keyworkerList={keyworkList}
        handleKeyworkerChange={() => {}}
        postManualOverride={() => {}}
        applyDateFilter={() => {}}
        onFinishAllocation={() => {}}
        history={mockHistory}
      />
    )
    expect(component.find('tr').at(2).find('td').at(5).text()).toMatch(/999 \(no details available\)/)
  })
})
