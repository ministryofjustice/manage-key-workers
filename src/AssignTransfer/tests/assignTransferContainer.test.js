import React from 'react'
import { shallow } from 'enzyme'
import { AssignTransferContainer } from '../AssignTransferContainer'

jest.mock('../../Spinner/index', () => '')

const props = {
  user: {
    activeCaseLoadId: '1',
    caseLoadOptions: [],
    expiredFlag: false,
    firstName: 'Test',
    lastName: 'User',
    lockedFlag: false,
    maintainAccess: false,
    maintainAccessAdmin: false,
    migration: false,
    staffId: 1,
    username: 'TestUser',
    writeAccess: false,
  },
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
    expect(component.find('Connect(OffenderSearchContainer)').exists()).toEqual(true)
  })

  it('should render results correctly', async () => {
    const component = shallow(<AssignTransferContainer setErrorDispatch={() => {}} {...props} />)
    expect(component.find('Connect(withRouter(OffenderResultsContainer))').exists()).toEqual(true)
  })
})
