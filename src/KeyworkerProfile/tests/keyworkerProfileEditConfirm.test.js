import React from 'react'
import { shallow } from 'enzyme'
import KeyworkerProfileEditConfirm from '../components/KeyworkerProfileEditConfirm'

const keyworker = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'INACTIVE',
  statusDescription: 'Inactive',
  capacity: 8,
}

const hist = { goBack: jest.fn() }

describe('Keyworker Profile Edit component', () => {
  it('should render component correctly w with INACTIVE status', async () => {
    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleCancel={jest.fn()}
        handleOptionChange={jest.fn()}
        status="INACTIVE"
        history={hist}
        handleDateChange={jest.fn()}
      />
    )
    expect(component.text()).toContain(
      'This will remove the key worker from the auto-allocation pool and release all of their allocated prisoners.'
    )
    expect(component.find('input').length).toEqual(0) // no options shown
    expect(component.find('#keyworker-status').hasClass('inactiveStatus')).toBe(true)
    expect(component.find('DatePickerInput').length).toEqual(0)
    expect(component.find('a.backlink').length).toEqual(1)
  })

  it('should render component correctly with UNAVAILABLE_ANNUAL_LEAVE status', async () => {
    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleCancel={jest.fn()}
        handleOptionChange={jest.fn()}
        status="UNAVAILABLE_ANNUAL_LEAVE"
        history={hist}
        handleDateChange={jest.fn()}
      />
    )
    expect(component.text()).toContain('Choose an option')
    expect(component.find('input').length).toEqual(3)
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true)
    expect(component.find('DatePickerInput').length).toEqual(1)
  })

  it('should render component correctly with UNAVAILABLE_LONG_TERM_ABSENCE status', async () => {
    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleCancel={jest.fn()}
        handleOptionChange={jest.fn()}
        status="UNAVAILABLE_LONG_TERM_ABSENCE"
        history={hist}
        handleDateChange={jest.fn()}
      />
    )
    expect(component.text()).toContain('Choose an option')
    expect(component.find('input').length).toEqual(3)
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true)
    expect(component.find('DatePickerInput').length).toEqual(0)
  })

  it('should render component correctly with UNAVAILABLE_NO_PRISONER_CONTACT status', async () => {
    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleCancel={jest.fn()}
        handleOptionChange={jest.fn()}
        status="UNAVAILABLE_NO_PRISONER_CONTACT"
        history={hist}
        handleDateChange={jest.fn()}
      />
    )
    expect(component.text()).toContain('Choose an option')
    expect(component.find('input').length).toEqual(3)
    expect(component.find('#keyworker-status').hasClass('unavailableStatus')).toBe(true)
    expect(component.find('DatePickerInput').length).toEqual(0)
  })

  it('should handle save click correctly', async () => {
    const handleSave = jest.fn()

    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={handleSave}
        handleCancel={jest.fn()}
        handleOptionChange={jest.fn()}
        history={hist}
        handleDateChange={jest.fn()}
      />
    )

    component.find('.button-save').simulate('click')
    expect(handleSave.mock.calls.length).toEqual(1)
  })

  it('should handle cancel click correctly', async () => {
    const handleCancel = jest.fn()

    const component = shallow(
      <KeyworkerProfileEditConfirm
        keyworker={keyworker}
        handleSaveChanges={jest.fn()}
        handleCancel={handleCancel}
        handleOptionChange={jest.fn()}
        history={hist}
        handleDateChange={jest.fn()}
      />
    )

    component.find('.button-cancel').simulate('click')
    expect(handleCancel.mock.calls.length).toEqual(1)
  })
})
