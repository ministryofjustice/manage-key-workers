import React from 'react'
import { shallow } from 'enzyme'
import { AssignTransferContainer } from '../AssignTransferContainer'

jest.mock('../../Spinner/index', () => '')

const props = {
  user: {},
  error: '',
  searchText: '',
  allocationStatus: '',
  housingLocation: '',
  offenderSearchTextDispatch: jest.fn(),
  offenderSearchAllocationStatusDispatch: jest.fn(),
  offenderSearchHousingLocationDispatch: jest.fn(),
  displayBack: jest.fn(),
}

describe('AssignTransferContainer', () => {
  it('should render initial Search correctly', async () => {
    const component = shallow(
      <AssignTransferContainer initialSearch setErrorDispatch={() => {}} user={{}} {...props} />
    )
    expect(
      component
        .find('div')
        .at(1)
        .text()
    ).toContain('Search for an offender')
  })

  it('should render results correctly', async () => {
    const component = shallow(<AssignTransferContainer setErrorDispatch={() => {}} {...props} />)
    const connect = component.find('Connect')
    expect(connect.text()).toContain('OffenderResultsContainer')
  })
})
