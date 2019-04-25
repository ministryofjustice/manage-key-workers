import React from 'react'
import renderer from 'react-test-renderer'
import AuthUserCreate from './AuthUserCreate'

describe('Auth Create form', () => {
  const stubFunc = () => {}
  describe('Form', () => {
    it('should render correctly', () => {
      const wrapper = renderer.create(<AuthUserCreate handleChange={stubFunc} handleCreate={stubFunc} />).toJSON()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
