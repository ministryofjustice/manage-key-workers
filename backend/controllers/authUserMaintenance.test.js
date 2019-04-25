const authUserMaintenanceFactory = require('./authUserMaintenance')

describe('Auth user maintenance controller', () => {
  const oauthApi = {}
  const res = { locals: {} }
  const { search, roles, addRole, removeRole, getUser, allRoles, createUser } = authUserMaintenanceFactory(oauthApi)

  beforeEach(() => {
    oauthApi.getUser = jest.fn()
    oauthApi.userSearch = jest.fn()
    oauthApi.userRoles = jest.fn()
    oauthApi.addUserRole = jest.fn()
    oauthApi.removeUserRole = jest.fn()
    oauthApi.allRoles = jest.fn()
    oauthApi.createUser = jest.fn()
    res.json = jest.fn()
    res.status = jest.fn()
  })

  describe('search', () => {
    it('should call getUser if no @ in query', async () => {
      const response = { username: 'bob' }

      oauthApi.getUser.mockReturnValueOnce(response)

      await search({ query: { nameFilter: 'bob' } }, res)

      expect(res.json).toBeCalledWith([response])
    })

    it('should call userSearch if @ in query', async () => {
      const response = [{ username: 'bob' }, { username: 'joe' }]

      oauthApi.userSearch.mockReturnValueOnce(response)

      await search({ query: { nameFilter: 'bob@joe.com' } }, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('no results', () => {
      beforeEach(async () => {
        oauthApi.userSearch.mockReturnValue('')
        await search({ query: { nameFilter: 'bob@joe.com' } }, res)
      })

      it('should return json error if no results', async () => {
        expect(res.json).toBeCalledWith([
          { targetName: 'user', text: 'No accounts for email address bob@joe.com found' },
        ])
      })
      it('show return not found status', () => {
        expect(res.status).toBeCalledWith(404)
      })
    })

    describe('missing query', () => {
      beforeEach(async () => {
        await search({ query: {} }, res)
      })

      it('should return 400 if missing query', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Enter a username or email address' }])
      })
      it('show return not found status', () => {
        expect(res.status).toBeCalledWith(400)
      })
    })

    describe('known issue', () => {
      const response = { status: 419, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.getUser.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await search({ query: { nameFilter: 'joe' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(419)
      })
    })

    it('should throw error through if unknown issue occurs', async () => {
      const response = { status: 500, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      const e = new Error('something went wrong')
      oauthApi.getUser.mockImplementation(() => {
        const error = new Error('something went wrong')
        error.response = response
        throw error
      })

      await expect(search({ query: { nameFilter: 'joe' } }, res)).rejects.toThrow(e)
    })
  })

  describe('getUser', () => {
    it('should call getUser', async () => {
      const response = { username: 'bob' }

      oauthApi.getUser.mockReturnValueOnce(response)

      await getUser({ query: { username: 'bob' } }, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('known issue', () => {
      const response = { status: 419, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.getUser.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await getUser({ query: { username: 'joe' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(419)
      })
    })

    it('should throw error through if unknown issue occurs', async () => {
      const response = { status: 500, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      const e = new Error('something went wrong')
      oauthApi.getUser.mockImplementation(() => {
        const error = new Error('something went wrong')
        error.response = response
        throw error
      })

      await expect(search({ query: { nameFilter: 'joe' } }, res)).rejects.toThrow(e)
    })
  })

  describe('roles', () => {
    it('should call roles', async () => {
      const response = [{ roleCode: 'bob' }, { roleCode: 'joe' }]

      oauthApi.userRoles.mockReturnValueOnce(response)

      await roles({ query: { username: 'joe' } }, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('missing query', () => {
      beforeEach(async () => {
        await roles({ query: {} }, res)
      })

      it('should return 400 if missing query', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Enter a username' }])
      })
      it('show return not found status', () => {
        expect(res.status).toBeCalledWith(400)
      })
    })

    describe('known issue', () => {
      const response = { status: 404, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.userRoles.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await roles({ query: { username: 'joe' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(404)
      })
    })
  })

  describe('addRole', () => {
    it('should call addRole', async () => {
      const response = {}

      oauthApi.addUserRole.mockReturnValueOnce(response)

      await addRole({ query: { username: 'joe', role: 'maintain' } }, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('missing query', () => {
      beforeEach(async () => {
        await addRole({ query: { username: 'joe' } }, res)
      })

      it('should return 400 if missing query', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'role', text: 'Select a role' }])
      })
      it('show return not found status', () => {
        expect(res.status).toBeCalledWith(400)
      })
    })

    describe('known issue', () => {
      const response = { status: 404, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.addUserRole.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await addRole({ query: { username: 'joe', role: 'role' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'role', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(404)
      })
    })
  })

  describe('removeRole', () => {
    it('should call removeRole', async () => {
      const response = {}

      oauthApi.removeUserRole.mockReturnValueOnce(response)

      await removeRole({ query: { username: 'joe', role: 'maintain' } }, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('missing query', () => {
      beforeEach(async () => {
        await removeRole({ query: { username: 'joe' } }, res)
      })

      it('should return 400 if missing query', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'role', text: 'Select a role to remove' }])
      })
      it('show return not found status', () => {
        expect(res.status).toBeCalledWith(400)
      })
    })

    describe('known issue', () => {
      const response = { status: 404, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.removeUserRole.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await removeRole({ query: { username: 'joe', role: 'role' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'role', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(404)
      })
    })
  })

  describe('allRoles', () => {
    it('should call roles', async () => {
      const response = [{ roleCode: 'bob' }, { roleCode: 'joe' }]

      oauthApi.allRoles.mockReturnValueOnce(response)

      await allRoles({}, res)

      expect(res.json).toBeCalledWith(response)
    })

    describe('known issue', () => {
      const response = { status: 404, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      beforeEach(async () => {
        oauthApi.allRoles.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await allRoles({ query: { username: 'joe' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(404)
      })
    })
  })

  describe('createUser', () => {
    it('should call createUser', async () => {
      const response = {}
      const user = { firstName: 'joe', email: 'bob@joe.com' }

      oauthApi.createUser.mockReturnValueOnce(response)

      await createUser({ query: { username: 'bob' }, body: user }, res)

      expect(oauthApi.createUser).toBeCalledWith({}, 'bob', user)
    })

    describe('known issue', () => {
      const response = {
        status: 419,
        data: { error: 'Not Found', field: 'email', error_description: 'Some problem occurred' },
      }

      beforeEach(async () => {
        oauthApi.createUser.mockImplementation(() => {
          const error = new Error('something went wrong')
          error.response = response
          throw error
        })

        await createUser({ query: { username: 'joe' } }, res)
      })
      it('should pass error through if known issue occurs', async () => {
        expect(res.json).toBeCalledWith([{ targetName: 'email', text: 'Some problem occurred', error: 'Not Found' }])
      })
      it('show pass through status', () => {
        expect(res.status).toBeCalledWith(419)
      })
    })

    it('should throw error through if unknown issue occurs', async () => {
      const response = { status: 500, data: { error: 'Not Found', error_description: 'Some problem occurred' } }

      const e = new Error('something went wrong')
      oauthApi.createUser.mockImplementation(() => {
        const error = new Error('something went wrong')
        error.response = response
        throw error
      })

      await expect(createUser({ query: { nameFilter: 'joe' } }, res)).rejects.toThrow(e)
    })

    it('should map known error conditions', async () => {
      const response = {
        status: 400,
        data: { error: 'email.domain', field: 'email', error_description: 'Some problem occurred' },
      }

      oauthApi.createUser.mockImplementation(() => {
        const error = new Error('something went wrong')
        error.response = response
        throw error
      })

      await createUser({ query: { nameFilter: 'joe' } }, res)

      expect(res.json).toBeCalledWith([
        {
          targetName: 'email',
          text: 'The email domain is not allowed.  Enter a work email address',
          error: 'email.domain',
        },
      ])
    })
  })
})
