const currentUser = require('./currentUser')

describe('Current user', () => {
  const prisonApi = {}
  const oauthApi = {}
  let req
  let res

  beforeEach(() => {
    prisonApi.userCaseLoads = jest.fn()
    prisonApi.setActiveCaseload = jest.fn()
    oauthApi.currentUser = jest.fn()

    oauthApi.currentUser.mockReturnValue({
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })

    req = { session: {} }
    res = { locals: {} }

    prisonApi.userCaseLoads.mockReturnValue([{ caseLoadId: 'MDI', description: 'Moorland' }])
  })

  it('should request and store user details', async () => {
    const controller = currentUser({ prisonApi, oauthApi })

    await controller(req, res, () => {})

    expect(oauthApi.currentUser).toHaveBeenCalled()
    expect(req.session.userDetails).toEqual({
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })

  it('should request and store user case loads', async () => {
    const controller = currentUser({ prisonApi, oauthApi })

    await controller(req, res, () => {})

    expect(prisonApi.userCaseLoads).toHaveBeenCalled()
    expect(req.session.allCaseloads).toEqual([{ caseLoadId: 'MDI', description: 'Moorland' }])
  })

  it('should stash data into res.locals', async () => {
    const controller = currentUser({ prisonApi, oauthApi })

    await controller(req, res, () => {})

    expect(res.locals.user).toEqual({
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
    const controller = currentUser({ prisonApi, oauthApi })
    req.xhr = true

    const next = jest.fn()

    await controller(req, res, next)

    expect(oauthApi.currentUser.mock.calls.length).toEqual(0)
    expect(prisonApi.userCaseLoads.mock.calls.length).toEqual(0)
    expect(next).toHaveBeenCalled()
  })

  it('should default active caseload when not set', async () => {
    oauthApi.currentUser.mockReturnValue({
      name: 'Bob Smith',
      activeCaseLoadId: null,
    })

    const controller = currentUser({ prisonApi, oauthApi })

    await controller(req, res, () => {})

    expect(oauthApi.currentUser).toHaveBeenCalled()
    expect(prisonApi.setActiveCaseload).toHaveBeenCalledWith(res.locals, { caseLoadId: 'MDI', description: 'Moorland' })
    expect(req.session.userDetails).toEqual({
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })

  it('should not set caseload when already set', async () => {
    oauthApi.currentUser.mockReturnValue({
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })

    const controller = currentUser({ prisonApi, oauthApi })

    req = {
      session: {
        userDetails: { activeCaseLoadId: 'MDI', name: 'Bob Smith' },
        allCaseloads: [{ caseLoadId: 'MDI', description: 'Moorland' }],
      },
    }

    await controller(req, res, () => {})

    expect(oauthApi.currentUser).toHaveBeenCalled()
    expect(prisonApi.setActiveCaseload).not.toHaveBeenCalled()
    expect(req.session.userDetails).toEqual({
      name: 'Bob Smith',
      activeCaseLoadId: 'MDI',
    })
  })
})
