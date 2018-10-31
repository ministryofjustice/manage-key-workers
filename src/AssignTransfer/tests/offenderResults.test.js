import React from 'react'
import { shallow } from 'enzyme'
import { OffenderResults } from '../components/OffenderResults'
import mockHistory from '../../test/mockHistory'

const OFFENDER_NAME_COLUMN = 0
const NOMS_ID_COLUMN = 1
const LOCATION_COLUMN = 2
const CRD_COLUMN = 3
const CSRA_COLUMN = 4
const KEYWORKER_NAME_COLUMN = 5
const KEYWORKER_HISTORY_VIEW_COLUMN = 6
const KEYWORKER_SELECT_COLUMN = 7

const offenderResponse = [
  {
    bookingId: 1,
    lastName: 'Rendell',
    firstName: 'Steve',
    offenderNo: 'ZZ124WX',
    assignedLivingUnitDesc: 'L-1-1',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: 'Standard',
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 4,
    staffId: 123,
  },
  {
    bookingId: 2,
    lastName: 'Rendell2',
    firstName: 'Steve2',
    offenderNo: 'ZZ125WX',
    assignedLivingUnitDesc: 'L-1-2',
    confirmedReleaseDate: '2019-10-20',
    crsaClassification: null,
    keyworkerDisplay: null,
    staffId: 999,
  },
  {
    bookingId: 3,
    lastName: 'Bennett',
    firstName: 'Lucinda',
    offenderNo: 'ZB125WX',
    assignedLivingUnitDesc: 'L-2-2',
    // missing confirmedReleaseDate: "2019-10-20",
    // missing crsaClassification: NO_DATA,
    keyworkerDisplay: 'Hanson, Sam',
    numberAllocated: 5,
    staffId: 123,
  },
]

const offenderResponseLongList = new Array(20).fill({}).map((a, i) => ({ ...a, bookingId: i, offenderNo: i }))

const keyworkerResponse = [
  {
    staffId: 123,
    firstName: 'Amy',
    lastName: 'Hanson',
    // numberAllocated missing
  },
  {
    staffId: 124,
    firstName: 'Sam',
    lastName: 'Hanson',
    numberAllocated: 6,
  },
]

const results = { offenderResponse, keyworkerResponse }

const resultsLongList = { offenderResponse: offenderResponseLongList, keyworkerResponse }

let user = {
  writeAccess: true,
}

describe('Offender results component', () => {
  it('should render initial offender results form correctly', async () => {
    const component = shallow(
      <OffenderResults
        user={{}}
        loaded
        keyworkerList={keyworkerResponse}
        offenderResults={results}
        history={mockHistory}
        displayBack={jest.fn()}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        message=""
      />
    )
    expect(component.find('tr').length).toEqual(4) // 3 plus table header tr
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(OFFENDER_NAME_COLUMN)
        .text()
    ).toEqual('Rendell, Steve')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(NOMS_ID_COLUMN)
        .text()
    ).toEqual('ZZ124WX')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(LOCATION_COLUMN)
        .text()
    ).toEqual('L-1-1')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(CRD_COLUMN)
        .text()
    ).toEqual('20/10/2019')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(CSRA_COLUMN)
        .text()
    ).toEqual('Standard')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(KEYWORKER_NAME_COLUMN)
        .text()
    ).toContain('Hanson, Sam')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(KEYWORKER_HISTORY_VIEW_COLUMN)
        .text()
    ).toContain('View')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(KEYWORKER_SELECT_COLUMN)
        .text()
    ).toContain('Hanson, Sam (6)')

    expect(
      component
        .find('tr')
        .at(2)
        .find('td')
        .at(OFFENDER_NAME_COLUMN)
        .text()
    ).toEqual('Rendell2, Steve2')
    expect(
      component
        .find('tr')
        .at(2)
        .find('td')
        .at(CSRA_COLUMN)
        .text()
    ).toEqual('--')

    expect(
      component
        .find('tr')
        .at(3)
        .find('td')
        .at(OFFENDER_NAME_COLUMN)
        .text()
    ).toEqual('Bennett, Lucinda')
    expect(
      component
        .find('tr')
        .at(3)
        .find('td')
        .at(CRD_COLUMN)
        .text()
    ).toEqual('--')
    expect(
      component
        .find('tr')
        .at(3)
        .find('td')
        .at(CSRA_COLUMN)
        .text()
    ).toEqual('--')
  })

  it('should duplicate buttons when list is long', async () => {
    const component = shallow(
      <OffenderResults
        loaded
        keyworkerList={keyworkerResponse}
        offenderResults={resultsLongList}
        history={mockHistory}
        displayBack={jest.fn()}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        user={user}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        message=""
      />
    )
    expect(component.find('tr').length).toEqual(21) // includes table header tr
    expect(component.find('.button-save').length).toEqual(2)
    expect(component.find('.button-cancel').length).toEqual(2)
  })

  it('should handle submit form correctly', async () => {
    const postManualOverride = jest.fn()
    const cancel = jest.fn()
    const component = shallow(
      <OffenderResults
        loaded
        offenderResults={results}
        postManualOverride={postManualOverride}
        onFinishAllocation={cancel}
        history={mockHistory}
        displayBack={jest.fn()}
        user={user}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    component.find('.button-save').simulate('click')
    expect(postManualOverride).toHaveBeenCalled()
    expect(cancel).not.toHaveBeenCalled()
  })

  it('should handle cancel form correctly', async () => {
    const postManualOverride = jest.fn()
    const cancel = jest.fn()
    const component = shallow(
      <OffenderResults
        loaded
        offenderResults={results}
        postManualOverride={postManualOverride}
        onFinishAllocation={cancel}
        history={mockHistory}
        displayBack={jest.fn()}
        user={user}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    component.find('.button-cancel').simulate('click')
    expect(postManualOverride).not.toHaveBeenCalled()
    expect(cancel).toHaveBeenCalled()
  })

  it('should disable the assign new key worker drop down when the user has no write access', () => {
    const component = shallow(
      <OffenderResults
        user={{}}
        loaded
        offenderResults={results}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    const dropDown = component
      .find('tr')
      .at(1)
      .find('td')
      .at(KEYWORKER_SELECT_COLUMN)
      .find('select')

    expect(dropDown.props().disabled).toBe(true)
  })

  it('should not disable the assign new key worker drop down when the user has write access', () => {
    user = {
      writeAccess: true,
    }
    const component = shallow(
      <OffenderResults
        loaded
        offenderResults={results}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        user={user}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    const dropDown = component
      .find('tr')
      .at(1)
      .find('td')
      .at(KEYWORKER_SELECT_COLUMN)
      .find('select')

    expect(dropDown.props().disabled).toBe(false)
  })

  it('should hide the confirm and cancel buttons when the user does not have write access', () => {
    const component = shallow(
      <OffenderResults
        user={{}}
        loaded
        offenderResults={results}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    expect(component.find('.button-save').length).toBe(0)
    expect(component.find('.button-cancel').length).toBe(0)
  })

  it('should not hide the confirm and cancel buttons when the user has write access', () => {
    const component = shallow(
      <OffenderResults
        loaded
        offenderResults={results}
        postManualOverride={jest.fn()}
        onFinishAllocation={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        user={user}
        handleKeyworkerChange={jest.fn()}
        keyworkerChangeList={[]}
        keyworkerList={[]}
        message=""
      />
    )

    expect(component.find('.button-save').length).toBe(1)
    expect(component.find('.button-cancel').length).toBe(1)
  })
})
