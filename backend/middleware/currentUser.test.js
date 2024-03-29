const currentUser = require('./currentUser')

describe('Current user', () => {
  const prisonApi = {}
  const hmppsManageUsersApi = {}
  let req
  let res

  beforeEach(() => {
    prisonApi.userCaseLoads = jest.fn()
    prisonApi.setActiveCaseload = jest.fn()
    hmppsManageUsersApi.currentUser = jest.fn()

    hmppsManageUsersApi.currentUser.mockReturnValue({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })

    req = { session: {} }
    res = { locals: {} }

    prisonApi.userCaseLoads.mockReturnValue([{ caseLoadId: 'MDI', description: 'Moorland' }])
  })

  it('should request and store user details', async () => {
    const controller = currentUser({ prisonApi, hmppsManageUsersApi })

    await controller(req, res, () => {})

    expect(hmppsManageUsersApi.currentUser).toHaveBeenCalled()
    expect(req.session.userDetails).toEqual({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })

  it('should request and store user case loads', async () => {
    const controller = currentUser({ prisonApi, hmppsManageUsersApi })

    await controller(req, res, () => {})

    expect(prisonApi.userCaseLoads).toHaveBeenCalled()
    expect(req.session.allCaseloads).toEqual([{ caseLoadId: 'MDI', description: 'Moorland' }])
  })

  it('should stash data into res.locals', async () => {
    const controller = currentUser({ prisonApi, hmppsManageUsersApi })

    await controller(req, res, () => {})

    expect(res.locals.user).toEqual({
      username: 'BSMITH',
      allCaseloads: [
        {
          caseLoadId: 'MDI',
          description: 'Moorland',
        },
      ],
      activeCaseLoad: {
        caseLoadId: 'MDI',
        description: 'Moorland',
      },
      displayName: 'B. Smith',
    })
  })

  it('ignore xhr requests', async () => {
    const controller = currentUser({ prisonApi, hmppsManageUsersApi })
    req.xhr = true

    const next = jest.fn()

    await controller(req, res, next)

    expect(hmppsManageUsersApi.currentUser.mock.calls.length).toEqual(0)
    expect(prisonApi.userCaseLoads.mock.calls.length).toEqual(0)
    expect(next).toHaveBeenCalled()
  })

  it('should default active caseload when not set', async () => {
    hmppsManageUsersApi.currentUser.mockReturnValue({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: null,
    })

    const controller = currentUser({ prisonApi, hmppsManageUsersApi })

    await controller(req, res, () => {})

    expect(hmppsManageUsersApi.currentUser).toHaveBeenCalled()
    expect(prisonApi.setActiveCaseload).toHaveBeenCalledWith(res.locals, { caseLoadId: 'MDI', description: 'Moorland' })
    expect(req.session.userDetails).toEqual({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })

  it('should not set caseload when already set', async () => {
    hmppsManageUsersApi.currentUser.mockReturnValue({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })

    const controller = currentUser({ prisonApi, hmppsManageUsersApi })

    req = {
      session: {
        username: 'BSMITH',
        userDetails: { activeCaseLoadId: 'MDI', name: 'Bob Smith' },
        allCaseloads: [{ caseLoadId: 'MDI', description: 'Moorland' }],
      },
    }

    await controller(req, res, () => {})

    expect(hmppsManageUsersApi.currentUser).toHaveBeenCalled()
    expect(prisonApi.setActiveCaseload).not.toHaveBeenCalled()
    expect(req.session.userDetails).toEqual({
      username: 'BSMITH',
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })
})
