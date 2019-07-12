import React from 'react'
import renderer from 'react-test-renderer'
import AuthUserCreate from './AuthUserCreate'

const groups = [
  { groupCode: 'GROUP_1', groupName: 'Group 1' },
  { groupCode: 'GROUP_2', groupName: 'Group 2' },
  { groupCode: 'GROUP_3', groupName: 'Group 3' },
]

describe('Auth Create form', () => {
  const stubFunc = () => {}
  describe('Form', () => {
    it('should render correctly', () => {
      const wrapper = renderer
        .create(<AuthUserCreate handleChange={stubFunc} handleCreate={stubFunc} groupList={[]} />)
        .toJSON()
      expect(wrapper).toMatchSnapshot()
    })

    it('should render correctly with groups', () => {
      const wrapper = renderer
        .create(<AuthUserCreate handleChange={stubFunc} handleCreate={stubFunc} groupList={groups} />)
        .toJSON()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
