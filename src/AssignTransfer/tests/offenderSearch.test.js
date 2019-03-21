import React from 'react'
import { shallow } from 'enzyme'
import { OffenderSearch } from '../components/OffenderSearch'
import mockHistory from '../../test/mockHistory'

const housingLocations = [
  { locationId: 123, description: 'block 1', agencyId: 'TEST1', locationPrefix: 'pre', locationType: 'type' },
  { locationId: 223, description: 'block 2', agencyId: 'TEST2', locationPrefix: 'pre', locationType: 'type' },
]

const props = {
  searchText: '',
  validationErrors: {},
  housingLocation: '',
  allocationStatus: '',
  initialSearch: false,
  history: mockHistory,
}

describe('Offender search component', () => {
  it('should render initial offender search form correctly', async () => {
    const component = shallow(
      <OffenderSearch
        initialSearch
        locations={housingLocations}
        handleSearchTextChange={() => {}}
        handleSearchHousingLocationChange={() => {}}
        handleSearchAllocationStatusChange={() => {}}
        handleSubmit={jest.fn()}
        {...props}
      />
    )

    expect(component.find('#search-text').length).toBe(1)
    expect(component.find('#housing-location-select').length).toBe(1)
  })

  it('should render results offender search form correctly', async () => {
    const component = shallow(
      <OffenderSearch
        locations={housingLocations}
        handleSearchTextChange={() => {}}
        handleSearchHousingLocationChange={() => {}}
        handleSearchAllocationStatusChange={() => {}}
        handleSubmit={jest.fn()}
        {...props}
      />
    )
    expect(component.find('#search-text').length).toBe(1)
    expect(component.find('#housing-location-select').length).toBe(1)
  })

  it('should handle results submit form correctly', async () => {
    const handleSubmitMock = jest.fn()
    const component = shallow(
      <OffenderSearch
        locations={housingLocations}
        handleSearchTextChange={() => {}}
        handleSearchHousingLocationChange={() => {}}
        handleSearchAllocationStatusChange={() => {}}
        setValidationErrorDispatch={() => {}}
        handleSubmit={handleSubmitMock}
        {...props}
      />
    )

    component.find('form').simulate('submit')
    expect(handleSubmitMock).toHaveBeenCalled()
  })
})
