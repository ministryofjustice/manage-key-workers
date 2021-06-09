import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { OffenderResultsContainer } from './OffenderResultsContainer'
import mockHistory from '../../test/mockHistory'

const waitForAsync = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, 0)
  )

describe('OffenderResultsContainer', () => {
  const props = {
    error: '',
    searchText: '',
    allocationStatus: '',
    housingLocation: '',
    agencyId: '',
    offenderSearchResultsDispatch: jest.fn(),
    keyworkerChangeListDispatch: jest.fn(),
    keyworkerChangeList: [],
    keyworkerList: [],
    locations: [],
    handleError: jest.fn(),
    setMessageDispatch: jest.fn(),
    resetErrorDispatch: jest.fn(),
    setLoadedDispatch: jest.fn(),
    loaded: true,
    history: mockHistory,
    message: '',
    validationErrors: {},
  }

  describe('postManualOverride method', () => {
    it('should set the loading spinner correctly', async () => {
      const wrapper = shallow(<OffenderResultsContainer {...props} />)
      const mock = new MockAdapter(axios)

      mock.onPost('/api/manualoverride').reply(201)
      wrapper.instance().postManualOverride()

      expect(props.setLoadedDispatch.mock.calls[0][0]).toEqual(false)
      await waitForAsync()
      expect(props.setLoadedDispatch.mock.calls[1][0]).toEqual(true)
    })
  })
})
