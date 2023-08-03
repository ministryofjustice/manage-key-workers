const { userMeFactory } = require('./userMe')

const caseloads = [{ caseLoadId: 'LEI', currentlyActive: true }]
const staff1 = {
  staffId: 1,
  username: 'staff1',
}

describe('userMe controller', () => {
  const elite2Api = {
    userCaseLoads: () => {},
  }
  const hmppsManageUsersApi = {
    currentUser: () => {},
    currentRoles: () => {},
  }
  const keyworkerApi = {
    getPrisonMigrationStatus: () => {},
  }
  const { userMeService } = userMeFactory(hmppsManageUsersApi, elite2Api, keyworkerApi)
  const req = {}
  const res = { locals: {} }

  beforeEach(() => {
    elite2Api.userCaseLoads = jest.fn()
    hmppsManageUsersApi.currentUser = jest.fn()
    hmppsManageUsersApi.currentRoles = jest.fn()
    keyworkerApi.getPrisonMigrationStatus = jest.fn()

    hmppsManageUsersApi.currentUser.mockImplementation(() => staff1)
    hmppsManageUsersApi.currentRoles.mockImplementation(() => [])
    elite2Api.userCaseLoads.mockImplementation(() => caseloads)
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true,
    }))
    res.json = jest.fn()
  })

  describe('access checks', () => {
    const defaultUserMe = {
      ...staff1,
      activeCaseLoadId: 'LEI',
      prisonMigrated: true,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      writeAccess: false,
      maintainAuthUsers: false,
      groupManager: false,
      keyWorkerMonitor: false,
    }

    it('should default to no access if user has no roles', async () => {
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
      })
    })
    it('should have writeAccess when the user has the key worker admin role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'OMIC_ADMIN' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        writeAccess: true,
      })
    })
    it('should not have writeAccess when the prison has not been migrated regardless of roles', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'OMIC_ADMIN' }])
      keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
        migrated: false,
      }))
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        writeAccess: false,
        prisonMigrated: false,
      })
    })
    it('should have migration when the user has the keyworker migration role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'KW_MIGRATION' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        migration: true,
      })
    })
    it('should have maintainAccess when the user has the maintain access roles role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'MAINTAIN_ACCESS_ROLES' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        maintainAccess: true,
      })
    })
    it('should have maintainAccessAdmin when the user has the maintain access roles admin role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        maintainAccessAdmin: true,
      })
    })
    it('should have maintainAuthUsers when the user has the maintain auth users role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'MAINTAIN_OAUTH_USERS' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        maintainAuthUsers: true,
      })
    })
    it('should have groupManager when the user has the group manager role', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'AUTH_GROUP_MANAGER' }])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        groupManager: true,
      })
    })
    it('should give full access when user has all roles', async () => {
      hmppsManageUsersApi.currentRoles.mockImplementation(() => [
        { roleCode: 'MAINTAIN_OAUTH_USERS' },
        { roleCode: 'MAINTAIN_ACCESS_ROLES' },
        { roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN' },
        { roleCode: 'KW_MIGRATION' },
        { roleCode: 'OMIC_ADMIN' },
        { roleCode: 'KEYWORKER_MONITOR' },
      ])
      await userMeService(req, res)

      expect(res.json.mock.calls[0][0]).toEqual({
        ...defaultUserMe,
        maintainAccess: true,
        maintainAccessAdmin: true,
        keyWorkerMonitor: true,
        migration: true,
        writeAccess: true,
        maintainAuthUsers: true,
      })
    })
  })
  it('should call services and return expected data', async () => {
    hmppsManageUsersApi.currentRoles.mockImplementation(() => [{ roleCode: 'OMIC_ADMIN' }])
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true,
      supported: true,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 2,
      capacityTier1: 1,
      capacityTier2: 2,
    }))
    await userMeService(req, res)

    expect(hmppsManageUsersApi.currentUser).toHaveBeenCalled()
    expect(hmppsManageUsersApi.currentRoles).toHaveBeenCalledWith(res.locals)

    expect(res.json).toBeCalledWith({
      ...staff1,
      activeCaseLoadId: 'LEI',
      writeAccess: true,
      keyWorkerMonitor: false,
      prisonMigrated: true,
      maintainAccess: false,
      maintainAccessAdmin: false,
      migration: false,
      maintainAuthUsers: false,
      groupManager: false,
    })
  })
})
