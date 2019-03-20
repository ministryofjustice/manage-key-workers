import React from 'react'
import renderer from 'react-test-renderer'
import AuthUserSearch from './AuthUserSearch'

describe('Auth search form', () => {
  const stubFunc = () => {}
  describe('Form', () => {
    it('should render correctly with no user', () => {
      const wrapper = renderer
        .create(<AuthUserSearch handleChange={stubFunc} handleSearch={stubFunc} user="" />)
        .toJSON()
      expect(wrapper).toMatchSnapshot()
    })
    it('should render correctly with a user', () => {
      const wrapper = renderer
        .create(<AuthUserSearch handleChange={stubFunc} handleSearch={stubFunc} user="someuser" />)
        .toJSON()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
