import React from 'react'
import { shallow } from 'enzyme'
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit'
import Status from '../components/Status'
import mockHistory from '../../test/mockHistory'

const keyworker = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'INACTIVE',
  statusDescription: 'Inactive',
  capacity: 8,
  agencyId: '',
  agencyDescription: 'Agency description',
  autoAllocationAllowed: false,
  numberAllocated: 1,
  scheduleType: '',
}

describe('Keyworker Profile Edit component', () => {
  it('should render component correctly', async () => {
    const component = shallow(
      <KeyworkerProfileEdit
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleStatusChange={jest.fn()}
        handleCapacityChange={jest.fn()}
        handleCancel={jest.fn()}
        history={mockHistory}
        status=""
        capacity="0"
        validationErrors={{}}
      />
    )
    expect(component.text()).toContain('Frank Butcher')
    const selectComponent = component.find('Status').shallow()
    expect(selectComponent.find('option').length).toEqual(5)
    expect(component.find('a.backlink').length).toEqual(1)
  })

  it('should handle save click correctly', async () => {
    const handleSave = jest.fn()

    const component = shallow(
      <KeyworkerProfileEdit
        keyworker={keyworker}
        handleSaveChanges={handleSave}
        handleStatusChange={jest.fn()}
        handleCapacityChange={jest.fn()}
        handleCancel={jest.fn()}
        history={mockHistory}
        status=""
        capacity="0"
        validationErrors={{}}
      />
    )

    component.find('.button-save').simulate('click')
    expect(handleSave.mock.calls.length).toEqual(1)
  })

  it('should handle cancel click correctly', async () => {
    const handleCancel = jest.fn()

    const component = shallow(
      <KeyworkerProfileEdit
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleStatusChange={jest.fn()}
        handleCapacityChange={jest.fn()}
        handleCancel={handleCancel}
        history={mockHistory}
        status=""
        capacity="0"
        validationErrors={{}}
      />
    )

    component.find('.button-cancel').simulate('click')
    expect(handleCancel.mock.calls.length).toEqual(1)
  })

  it('should render select with correct value', async () => {
    const component = shallow(<Status statusValue="INACTIVE" handleStatusChange={jest.fn()} />)
    expect(component.find('#status-select').get(0).props.value).toEqual('INACTIVE')
  })
})

describe('KeyworkerProfileContainer component', () => {
  // todo
})
