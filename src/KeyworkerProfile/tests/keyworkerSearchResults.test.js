import React from 'react'
import { shallow } from 'enzyme'
import KeyworkerSearchResult from '../components/KeyworkerSearchResults'
import mockHistory from '../../test/mockHistory'

const getTestData = () => [
  {
    staffId: 2,
    firstName: 'Brent',
    lastName: 'Daggart',
    numberAllocated: 3,
    status: 'ACTIVE',
    numKeyWorkerSessions: 2,
    currentRole: 'Key worker2',
  },
  {
    staffId: 1,
    firstName: 'Amy',
    lastName: 'Hanson',
    numberAllocated: 4,
    status: 'ACTIVE',
    numKeyWorkerSessions: 1,
    currentRole: 'Key worker',
  },
  {
    staffId: 3,
    firstName: 'Florence',
    lastName: 'Welch',
    numberAllocated: 1,
    numKeyWorkerSessions: 4,
    status: 'ACTIVE',
    currentRole: 'Key worker3',
  },
]

describe('Keyworker search result component', () => {
  it('should render component correctly', async () => {
    const list = getTestData()
    const component = shallow(
      <KeyworkerSearchResult
        keyworkerList={list}
        displayBack={jest.fn()}
        handleSearch={jest.fn()}
        handleSearchTextChange={jest.fn()}
        handleStatusChange={jest.fn()}
        handleStatusFilterChange={jest.fn()}
        user={{}}
        keyworkerSettings={{}}
        history={mockHistory}
        searchText=""
        statusFilter=""
        validationErrors={{}}
        status=""
      />
    )
    expect(component.find('tr').length).toEqual(4) // includes header tr
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(0)
        .text()
    ).toContain('Link')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(2)
        .text()
    ).toEqual('3')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(1)
        .text()
    ).toEqual('Active')
    expect(
      component
        .find('tr')
        .at(1)
        .find('td')
        .at(5)
        .text()
    ).toEqual('2')
  })
})
