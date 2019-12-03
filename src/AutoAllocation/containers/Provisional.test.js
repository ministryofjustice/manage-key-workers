import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { ProvisionalContainer } from './Provisional'
import mockHistory from '../../test/mockHistory'

const waitForAsync = () => new Promise(resolve => setImmediate(resolve))

describe('ProvisionalContainer', () => {
  const props = {
    error: '',
    handleError: jest.fn(),
    allocatedList: [],
    allocatedKeyworkers: [],
    onFinishAllocation: jest.fn(),
    agencyId: '',
    allocatedDetailsDispatch: jest.fn(),
    manualOverrideDispatch: jest.fn(),
    setMessageDispatch: jest.fn(),
    setLoadedDispatch: jest.fn(),
    loaded: true,
    user: {},
    history: mockHistory,
  }

  describe('postManualOverride method', () => {
    it('should set the loading spinner correctly', async () => {
      const wrapper = shallow(<ProvisionalContainer {...props} />)
      const mock = new MockAdapter(axios)

      mock.onPost('/api/autoAllocateConfirmWithOverride').reply(201)
      wrapper.instance().postManualOverride(mockHistory)

      expect(props.setLoadedDispatch.mock.calls[1][0]).toEqual(false)
      await waitForAsync()
      expect(props.setLoadedDispatch.mock.calls[2][0]).toEqual(true)
    })
  })
})
