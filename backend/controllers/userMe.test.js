const { userMeFactory } = require('./userMe')

const context = {}
const staffRoles = [{ roleId: -201, roleCode: 'OMIC_ADMIN', roleName: 'Omic Admin', caseloadId: 'NWEB' }]
const caseloads = [{ caseLoadId: 'LEI', currentlyActive: true }]
const staff1 = {
  staffId: 1,
  username: 'staff1',
  maintainAccess: false,
  maintainAccessAdmin: false,
  migration: false,
}

describe('userMe controller', () => {
  const elite2Api = {
    userCaseLoads: () => {},
  }
  const oauthApi = {
    currentUser: () => {},
    userRoles: () => {},
  }
  const keyworkerApi = {
    getPrisonMigrationStatus: () => {},
  }

  beforeEach(() => {
    elite2Api.userCaseLoads = jest.fn()
    oauthApi.currentUser = jest.fn()
    oauthApi.userRoles = jest.fn()
    keyworkerApi.getPrisonMigrationStatus = jest.fn()

    oauthApi.currentUser.mockImplementation(() => staff1)
    elite2Api.userCaseLoads.mockImplementation(() => caseloads)
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true,
    }))
  })

  it('should not have writeAccess when the user does not have the key worker admin role', async () => {
    oauthApi.userRoles.mockImplementation(() => [])
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: false,
      supported: false,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 1,
      capacityTier1: 1,
      capacityTier2: 2,
    }))
    const { userMeService } = userMeFactory(oauthApi, elite2Api, keyworkerApi)
    const data = await userMeService()

    expect(data).toEqual({
      ...staff1,
      activeCaseLoadId: 'LEI',
      writeAccess: false,
      prisonMigrated: false,
    })
  })
  it('should have writeAccess when the user has the key worker admin role', async () => {
    oauthApi.userRoles.mockImplementation(() => staffRoles)
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true,
      supported: true,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 2,
      capacityTier1: 1,
      capacityTier2: 2,
    }))
    const { userMeService } = userMeFactory(oauthApi, elite2Api, keyworkerApi)
    const data = await userMeService(context)

    expect(oauthApi.currentUser).toHaveBeenCalled()
    expect(oauthApi.userRoles).toHaveBeenCalledWith(context)

    expect(data).toEqual({
      ...staff1,
      activeCaseLoadId: 'LEI',
      writeAccess: true,
      prisonMigrated: true,
    })
  })
  it('should not have writeAccess when the prison has not been migrated regardless of roles', async () => {
    oauthApi.userRoles.mockImplementation(() => staffRoles)
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: false,
      supported: false,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 1,
      capacityTier1: 1,
      capacityTier2: 2,
    }))

    const { userMeService } = userMeFactory(oauthApi, elite2Api, keyworkerApi)

    const data = await userMeService(context)

    expect(oauthApi.currentUser).toHaveBeenCalled()
    expect(oauthApi.userRoles).toHaveBeenCalledWith(context)
    expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(context, 'LEI')

    expect(data).toEqual({
      ...staff1,
      activeCaseLoadId: 'LEI',
      writeAccess: false,
      prisonMigrated: false,
    })
  })
})
