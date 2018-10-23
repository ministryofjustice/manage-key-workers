import React from 'react'
import { shallow } from 'enzyme'
import { KeyworkerProfileEditConfirmContainer } from '../containers/KeyworkerProfileEditConfirmContainer'

const keyworkerAnnualLeave = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'UNAVAILABLE_ANNUAL_LEAVE',
  capacity: 8,
}

const keyworkerActive = {
  firstName: 'Frank',
  lastName: 'Butcher',
  staffId: 123,
  status: 'INACTIVE',
  capacity: 8,
}

describe('Keyworker Profile Edit component', () => {
  it('should validate empty choices and date picker for unavailable_annual_leave status', async () => {
    const resetValidation = jest.fn()
    const setValidation = jest.fn()
    const component = shallow(
      <KeyworkerProfileEditConfirmContainer
        setValidationErrorDispatch={setValidation}
        resetValidationErrorsDispatch={resetValidation}
        keyworker={keyworkerAnnualLeave}
        status="UNAVAILABLE_ANNUAL_LEAVE"
        handleSaveChanges={jest.fn()}
        setStatusChangeBehaviourDispatch={jest.fn()}
        dateDispatch={jest.fn()}
        handleCancel={jest.fn()}
        match={{}}
        history={{}}
        handleError={jest.fn()}
        handleOptionChange={jest.fn()}
        agencyId="LEI"
      />
    )
    const instance = component.instance()
    expect(instance.validate()).toBe(false)
    expect(resetValidation.mock.calls.length).toEqual(1)
    expect(setValidation.mock.calls.length).toEqual(2)
  })

  it('should only validate empty choices for INACTIVE status', async () => {
    const resetValidation = jest.fn()
    const setValidation = jest.fn()
    const component = shallow(
      <KeyworkerProfileEditConfirmContainer
        setValidationErrorDispatch={setValidation}
        resetValidationErrorsDispatch={resetValidation}
        keyworker={keyworkerActive}
        status="INACTIVE"
        handleSaveChanges={jest.fn()}
        setStatusChangeBehaviourDispatch={jest.fn()}
        dateDispatch={jest.fn()}
        handleCancel={jest.fn()}
        match={{}}
        history={{}}
        handleError={jest.fn()}
        handleOptionChange={jest.fn()}
        agencyId="LEI"
      />
    )
    const instance = component.instance()
    expect(instance.validate()).toBe(false)
    expect(resetValidation.mock.calls.length).toEqual(1)
    expect(setValidation.mock.calls.length).toEqual(1)
  })
})
