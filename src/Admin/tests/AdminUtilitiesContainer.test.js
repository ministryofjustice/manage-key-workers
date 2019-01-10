import React from 'react'
import { shallow } from 'enzyme'
import { AdminUtilitiesContainer } from '../containers/AdminUtilitiesContainer'

const props = {
  setLoadedDispatch: jest.fn(),
  user: {
    maintainAccessAdmin: false,
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
    writeAccess: true,
  },
  config: {
    keyworkerDashboardStatsEnabled: false,
    keyworkerProfileStatsEnabled: 'false',
    mailTo: 'email@test.com',
    maintainRolesEnabled: 'false',
    notmEndpointUrl: '//notm.url',
  },
  message: '',
}

describe('<AdminUtilitiesContainer />', () => {
  it('render with a message if there are no admin rights', () => {
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)

    expect(wrapper.find('p').text()).toEqual('There are no Admin or Utilities associated with your account.')
  })

  it('should render a Link to the Give access to New NOMIS Admin section if user has maintainAccess role', () => {
    props.user.maintainAccess = true
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)

    expect(wrapper.find('Link').prop('children')).toEqual('Give access to New NOMIS')
  })

  it('should render a Link to the Give access to New NOMIS Admin section maintainAccessAdmin role', () => {
    props.user.maintainAccess = false
    props.user.maintainAccessAdmin = true
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
    const giveAccessLink = wrapper.find('Link').find({ to: '/admin-utilities/give-nomis-access' })

    expect(giveAccessLink.prop('children')).toEqual('Give access to New NOMIS')
  })

  it('should render a Link to Maintain Roles Admin section maintainAccessAdmin role', () => {
    props.user.maintainAccess = true
    props.config.maintainRolesEnabled = 'true'
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
    const manageRolesLink = wrapper.find('Link').find({ to: '/admin-utilities/maintain-roles' })

    expect(manageRolesLink.prop('children')).toEqual('Manage access roles')
  })

  it('should render a Link to Manage key worker settings', () => {
    props.user.maintainAccess = true
    props.user.migration = true
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
    const keyworkerSettingsLink = wrapper.find('Link').find({ to: '/admin-utilities/manage-key-worker-settings' })

    expect(keyworkerSettingsLink.prop('children')).toEqual('Manage key worker settings')
  })
})
