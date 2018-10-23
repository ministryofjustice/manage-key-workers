import React from 'react'
import { shallow } from 'enzyme'
import KeyworkerSettings from '../components/KeyworkerSettings'

const user = {
  activeCaseLoadId: 'LEI',
  caseLoadOptions: [{ caseLoadId: 'LEI', description: 'LEEDS (HMP)', type: 'INST', caseloadFunction: 'GENERAL' }],
}

describe('Keyworker settings component', () => {
  it('should render settings for unsupported prison correctly', async () => {
    const component = shallow(
      <KeyworkerSettings
        user={user}
        supported={false}
        migrated={false}
        allowAuto={false}
        capacity={3}
        extCapacity={4}
        sequenceFrequency={2}
        handleSequenceFrequencyChange={jest.fn()}
        handleAllowAutoChange={jest.fn()}
        handleExtCapacityChange={jest.fn()}
        handleCapacityChange={jest.fn()}
        handleUpdate={jest.fn()}
        handleSequenceFrequency={jest.fn()}
      />
    )
    expect(component.text()).toContain('Not yet enabled')
    expect(component.find('#frequency-select').get(0).props.value).toEqual('2')
    expect(component.find('#capacity').get(0).props.value).toEqual(3)
    expect(component.find('#extCapacity').get(0).props.value).toEqual(4)
    expect(component.find('#frequency-select').find('option').length).toEqual(2)
    expect(component.find('#save-button').text()).toEqual('Save settings and migrate')
  })

  it('should render settings for supported prison correctly', async () => {
    const component = shallow(
      <KeyworkerSettings
        user={user}
        supported
        migrated={false}
        allowAuto={false}
        capacity={3}
        extCapacity={4}
        sequenceFrequency={2}
        handleSequenceFrequencyChange={jest.fn()}
        handleAllowAutoChange={jest.fn()}
        handleExtCapacityChange={jest.fn()}
        handleCapacityChange={jest.fn()}
        handleUpdate={jest.fn()}
        handleSequenceFrequency={jest.fn()}
      />
    )
    expect(component.text()).toContain('Enabled')
    expect(component.find('#frequency-select').get(0).props.value).toEqual('2')
    expect(component.find('#capacity').get(0).props.value).toEqual(3)
    expect(component.find('#extCapacity').get(0).props.value).toEqual(4)
    expect(component.find('#frequency-select').find('option').length).toEqual(2)
    expect(component.find('#save-button').text()).toEqual('Save settings')
  })
})
