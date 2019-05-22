import React from 'react'
import renderer from 'react-test-renderer'
import AuthUserAmend from './AuthUserAmend'

describe('Auth Amend form', () => {
  const stubFunc = () => {}
  describe('Form', () => {
    it('should render correctly', () => {
      const wrapper = renderer
        .create(
          <AuthUserAmend handleChange={stubFunc} handleAmend={stubFunc} handleCancel={stubFunc} email="john.smith" />
        )
        .toJSON()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
