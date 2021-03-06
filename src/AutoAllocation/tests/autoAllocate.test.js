import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'
import { UnallocatedContainer } from '../containers/Unallocated'
import { ProvisionalContainer } from '../containers/Provisional'
import mockHistory from '../../test/mockHistory'

const AXIOS_URL = 0
const AXIOS_CONFIG = 1

jest.mock('../../Spinner/index', () => 'div id="spinner"')

const user = {
  activeCaseLoadId: 'TEST',
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
  writeAccess: true,
}

describe('Unallocated component', () => {
  it('should get unallocated page correctly', async () => {
    const mockAxios = jest.fn()
    axios.get = mockAxios

    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ['s1', 's2'], config: {} }))

    await shallow(
      <UnallocatedContainer
        user={user}
        loaded
        agencyId="LEI"
        setMessageDispatch={jest.fn()}
        handleError={jest.fn()}
        unallocatedListDispatch={jest.fn()}
        setLoadedDispatch={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        error=""
        unallocatedList={[]}
        allocatedList={[]}
        allocatedKeyworkers={[]}
      />
    )

    expect(mockAxios.mock.calls.length).toBe(1)
    expect(mockAxios.mock.calls[0][0]).toBe('/api/unallocated')
  })

  it('should get spinner when page is loading - page loads unless loaded flag is provided', async () => {
    const mockAxios = jest.fn()
    axios.get = mockAxios

    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ['s1', 's2'], config: {} }))

    const component = await shallow(
      <UnallocatedContainer
        agencyId="LEI"
        setMessageDispatch={jest.fn()}
        handleError={jest.fn()}
        unallocatedListDispatch={jest.fn()}
        setLoadedDispatch={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        user={user}
        error=""
        unallocatedList={[]}
        loaded={false}
        allocatedList={[]}
        allocatedKeyworkers={[]}
      />
    )
    expect(component.find('#spinner').exists())
  })

  it('should get provisional allocation page correctly', async () => {
    const mockAxios = jest.fn()
    axios.get = mockAxios
    // /unallocated
    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ['s1', 's2'], config: {} }))
    // /allocated
    mockAxios.mockImplementationOnce(() => Promise.resolve({ status: 200, data: ['s3', 's4'], config: {} }))

    await shallow(
      <ProvisionalContainer
        user={user}
        loaded
        agencyId="LEI"
        onFinishAllocation={jest.fn()}
        setMessageDispatch={jest.fn()}
        handleError={jest.fn()}
        manualOverrideDispatch={jest.fn()}
        allocatedDetailsDispatch={jest.fn()}
        setLoadedDispatch={jest.fn()}
        history={mockHistory}
        displayBack={jest.fn()}
        error=""
        unallocatedList={[]}
        allocatedList={[]}
        allocatedKeyworkers={[]}
      />
    )

    expect(mockAxios.mock.calls.length).toBe(1)
    expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/allocated')
    expect(mockAxios.mock.calls[0][AXIOS_CONFIG].params.agencyId).toBe('LEI')
  })

  it('should render a middle tier error on unallocated page correctly', (done) => {
    const mockAxios = jest.fn() // v22+ .mockName('mockAxios');
    const errorDispatch = jest.fn()
    axios.get = mockAxios
    // /unallocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error('Request failed with status code 500,test error')))

    const component = shallow(
      <UnallocatedContainer
        user={user}
        loaded
        agencyId="LEI"
        handleError={errorDispatch}
        setMessageDispatch={jest.fn()}
        unallocatedListDispatch={jest.fn()}
        setLoadedDispatch={jest.fn()}
        error="Something went wrong: Error: Request failed with status code 500,test error"
        history={mockHistory}
        displayBack={jest.fn()}
        unallocatedList={[]}
        allocatedList={[]}
        allocatedKeyworkers={[]}
      />
    )

    setTimeout(() => {
      component.update()
      expect(mockAxios.mock.calls.length).toBe(1)
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/unallocated')
      // const usefulDump = component.debug();
      expect(errorDispatch.mock.calls[0][0].message).toBe('Request failed with status code 500,test error')
      done()
    }, 5)
  })

  it('should render a middle tier error on provisional allocation page correctly', (done) => {
    const mockAxios = jest.fn()
    const errorDispatch = jest.fn()
    axios.get = mockAxios
    // /allocated
    mockAxios.mockImplementationOnce(() => Promise.reject(new Error('Request failed with status code 500,test error')))

    const component = shallow(
      <ProvisionalContainer
        user={user}
        loaded
        agencyId="LEI"
        onFinishAllocation={jest.fn()}
        handleError={errorDispatch}
        setMessageDispatch={jest.fn()}
        manualOverrideDispatch={jest.fn()}
        allocatedDetailsDispatch={jest.fn()}
        setLoadedDispatch={jest.fn()}
        error="Something went wrong: Error: Request failed with status code 500,test error"
        history={mockHistory}
        displayBack={jest.fn()}
        unallocatedList={[]}
        allocatedList={[]}
        allocatedKeyworkers={[]}
      />
    )

    setTimeout(() => {
      component.update()
      expect(errorDispatch.mock.calls.length).toBe(1)
      expect(mockAxios.mock.calls.length).toBe(1)
      expect(mockAxios.mock.calls[0][AXIOS_URL]).toBe('/api/allocated')
      expect(errorDispatch.mock.calls[0][0].message).toBe('Request failed with status code 500,test error')
      done()
    }, 5)
  })
})
