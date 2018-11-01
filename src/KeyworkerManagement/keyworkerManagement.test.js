import React from 'react'
import { shallow } from 'enzyme'
import HomePage from './index'

const initialConfig = {
  maintainRolesEnabled: 'false',
  keyworkeProfileStatsEnabled: 'false',
  notmEndpointUrl: '/notm/endpoint',
  mailTo: 'email@test.com',
}

describe('HomePage component', () => {
  it('should render links correctly', async () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
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
    }
    const component = shallow(
      <HomePage message="Hello!" config={initialConfig} clearMessage={jest.fn()} user={user} allowAuto />
    )
    expect(component.find('#auto_allocate_link').length).toBe(1)
    expect(component.find('#keyworker_profile_link').length).toBe(1)
    expect(component.find('#assign_transfer_link').length).toBe(1)
  })
  it('should hide the auto allocate link when user does not have write access', () => {
    const user = {
      writeAccess: false,
      activeCaseLoadId: '',
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
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} config={initialConfig} user={user} allowAuto={false} />
    )
    expect(component.find('#auto_allocate_link').length).toBe(0)
  })
  it('should show the auto allocate link when allow autoallocate (keyworker settings) is true and user has writeAccess', () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
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
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto config={initialConfig} />
    )
    expect(component.find('#auto_allocate_link').length).toBe(1)
  })
  it('should hide the auto allocate link when allow autoallocate (keyworker settings) is false and user has writeAccess', () => {
    const user = {
      writeAccess: true,
      activeCaseLoadId: '',
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
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto={false} config={initialConfig} />
    )
    expect(component.find('#auto_allocate_link').length).toBe(0)
  })
  it('should hide the maintain roles link when feature toggle off', () => {
    const user = {
      writeAccess: true,
      maintainAccess: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const updatedConfig = {
      ...initialConfig,
      maintainRolesEnabled: 'false',
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto={false} config={updatedConfig} />
    )
    expect(component.find('#maintain_roles_link').length).toBe(0)
  })
  it('should show the maintain roles link when feature toggle on (and correct role exists for user)', () => {
    const user = {
      writeAccess: true,
      maintainAccess: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccessAdmin: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const updatedConfig = {
      ...initialConfig,
      maintainRolesEnabled: 'true',
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto={false} config={updatedConfig} />
    )
    expect(component.find('#maintain_roles_link').length).toBe(1)
  })
  it('should show the maintain roles link when feature toggle on (and maintain roles admin role exists for user)', () => {
    const user = {
      writeAccess: true,
      maintainAccessAdmin: true,
      activeCaseLoadId: '',
      caseLoadOptions: [],
      expiredFlag: false,
      firstName: 'Test',
      lastName: 'User',
      lockedFlag: false,
      maintainAccess: false,
      migration: false,
      staffId: 1,
      username: 'TestUser',
    }
    const updatedConfig = {
      ...initialConfig,
      maintainRolesEnabled: 'true',
    }
    const component = shallow(
      <HomePage message="Hello!" clearMessage={jest.fn()} user={user} allowAuto={false} config={updatedConfig} />
    )
    expect(component.find('#maintain_roles_link').length).toBe(1)
  })
})
