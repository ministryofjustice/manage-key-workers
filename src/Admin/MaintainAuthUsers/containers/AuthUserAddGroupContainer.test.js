import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import axios from 'axios'

import ConnectedAuthUserAddGroupContainer, { AuthUserAddGroupContainer } from './AuthUserAddGroupContainer'
import mockHistory from '../../../test/mockHistory'
import mockMatch from '../../../test/mockMatch'

const mockStore = configureMockStore([thunk])

const user = {
  username: 'joesmith',
  firstName: 'Joe',
  lastName: 'Smith',
  locked: false,
  enabled: true,
  email: 'joe.smith@justice.gov.uk',
}
const groups = [
  { groupCode: 'GROUP_1', groupName: 'Group 1' },
  { groupCode: 'GROUP_2', groupName: 'Group 2' },
  { groupCode: 'GROUP_3', groupName: 'Group 3' },
]

describe('Auth user add group container', () => {
  describe('rendering', () => {
    it('should render correctly without user', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: {}, groupList: [] },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddGroupContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user but no groups', () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user, groupList: [] },
      })

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddGroupContainer />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.contains(<div>User not found</div>)).toBe(true)
    })

    it('should render correctly with a user and groups', async () => {
      const store = mockStore({
        app: { error: '', loaded: true, message: '' },
        maintainAuthUsers: { contextUser: user, groupList: [] },
      })

      axios.get = jest.fn()
      axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: groups, config: {} }))

      const wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <ConnectedAuthUserAddGroupContainer />
          </MemoryRouter>
        </Provider>
      )
      await wrapper.update()
      expect(wrapper.find('Page').props().title).toEqual('Add group: Joe Smith')
    })
  })

  describe('handle functions', () => {
    const event = { target: { name: 'group', value: 'GROUP_1' }, preventDefault: jest.fn() }
    const groupList = [{ groupCode: 'groupA', groupName: 'Group A' }, { groupCode: 'groupB', groupName: 'Group B' }]
    const store = mockStore({ app: { error: '', loaded: true, message: '' } })

    let dispatchFns
    let wrapper
    beforeEach(async () => {
      dispatchFns = {
        removeAuthGroupDispatch: jest.fn(),
        loadAuthUserRolesAndGroupsDispatch: jest.fn(),
        resetErrorDispatch: jest.fn(),
        setErrorDispatch: jest.fn(),
        setLoadedDispatch: jest.fn(),
        setMessageDispatch: jest.fn(),
        handleAxiosErrorDispatch: jest.fn(),
      }
      wrapper = await mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthUserAddGroupContainer
              {...dispatchFns}
              contextUser={user}
              groupList={groupList}
              error=""
              message=""
              match={mockMatch({ username: 'joebook' })}
              history={mockHistory}
            />
          </MemoryRouter>
        </Provider>
      )
      await wrapper.update()
    })

    describe('handleAdd', () => {
      it('should require group to be selected when form submitted', () => {
        wrapper.find('form').simulate('submit', event)

        expect(dispatchFns.setErrorDispatch).toBeCalledWith([{ targetName: 'group', text: 'Select a group' }])
      })

      it('should call axios to add group', () => {
        axios.get = jest.fn()
        axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: groups, config: {} }))

        wrapper.find('#group select').simulate('change', event)
        wrapper.find('form').simulate('submit', event)

        expect(dispatchFns.setErrorDispatch).toHaveBeenCalledTimes(0)
        expect(axios.get).toHaveBeenCalledWith('/api/auth-user-groups-add', {
          params: { group: 'GROUP_1', username: 'joesmith' },
        })
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('form').simulate('submit', event)

        expect(event.preventDefault).toBeCalled()
      })
    })

    describe('handleCancel', () => {
      it('should call history go back', () => {
        wrapper.find('[data-qa="cancel-button"] button').simulate('click')

        expect(mockHistory.goBack).toHaveBeenCalled()
      })

      it('should prevent default on the form submission', () => {
        wrapper.find('[data-qa="cancel-button"] button').simulate('click', event)

        expect(event.preventDefault).toBeCalled()
      })
    })
  })
})
