import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { shallow, mount } from 'enzyme'

import AuthUserSearchContainer from './AuthUserSearchContainer'

describe('Auth search container', () => {
  it('should render correctly without existing location', () => {
    const wrapper = shallow(<AuthUserSearchContainer location={{ search: {} }} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly with search location', () => {
    const wrapper = shallow(<AuthUserSearchContainer location={{ search: { user: 'auser' } }} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('handle functions', () => {
    const event = { target: { name: 'user', value: 'usersearched' }, preventDefault: jest.fn() }
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    const state = { app: { error: '', loaded: true } }
    store.getState.mockReturnValue(state)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AuthUserSearchContainer />
        </MemoryRouter>
      </Provider>
    )
    wrapper.find('input#user').simulate('change', event)

    it('should set the user input on the state', () => {
      expect(wrapper.find('AuthUserSearchHoc').state().user).toEqual('usersearched')
    })

    it('should set history when form submitted', () => {
      wrapper.find('form').simulate('submit')

      const {
        location: { pathname, search },
      } = wrapper.find('AuthUserSearchContainer').props()

      expect(pathname).toEqual('/admin-utilities/maintain-auth-users/search-results')
      expect(search).toEqual('?user=usersearched')
    })

    it('should prevent default on the form submission', () => {
      const submitEvent = { target: { value: 'search' }, preventDefault: jest.fn() }
      wrapper.find('form').simulate('submit', submitEvent)

      expect(submitEvent.preventDefault).toBeCalled()
    })
  })
})
