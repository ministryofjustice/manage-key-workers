const { authUserSearchFactory } = require('./authUserSearch')

describe('Auth user search controller', () => {
  const oauthApi = {}
  const res = { locals: {} }
  const { authUserSearch } = authUserSearchFactory(oauthApi)

  beforeEach(() => {
    oauthApi.getUser = jest.fn()
    oauthApi.userSearch = jest.fn()
    res.json = jest.fn()
    res.status = jest.fn()
  })

  it('should call getUser if no @ in query', async () => {
    const response = { username: 'bob' }

    oauthApi.getUser.mockReturnValueOnce(response)

    await authUserSearch({ query: { nameFilter: 'bob' } }, res)

    expect(res.json).toBeCalledWith([response])
  })

  it('should call userSearch if @ in query', async () => {
    const response = [{ username: 'bob' }, { username: 'joe' }]

    oauthApi.userSearch.mockReturnValueOnce(response)

    await authUserSearch({ query: { nameFilter: 'bob@joe.com' } }, res)

    expect(res.json).toBeCalledWith(response)
  })

  describe('no results', () => {
    beforeEach(async () => {
      oauthApi.userSearch.mockReturnValue('')
      await authUserSearch({ query: { nameFilter: 'bob@joe.com' } }, res)
    })

    it('should return json error if no results', async () => {
      expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'No accounts for email address bob@joe.com found' }])
    })
    it('show return not found status', () => {
      expect(res.status).toBeCalledWith(404)
    })
  })

  describe('missing query', () => {
    beforeEach(async () => {
      await authUserSearch({ query: {} }, res)
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

      await authUserSearch({ query: { nameFilter: 'joe' } }, res)
    })
    it('should pass error through if known issue occurs', async () => {
      expect(res.json).toBeCalledWith([{ targetName: 'user', text: 'Some problem occurred' }])
    })
    it('show pass through status', () => {
      expect(res.status).toBeCalledWith(419)
    })
  })

  it('should throw error through if unknown issue occurs', async () => {
    const e = new Error('something went wrong')
    oauthApi.getUser.mockImplementation(() => {
      throw e
    })

    await expect(authUserSearch({ query: { nameFilter: 'joe' } }, res)).rejects.toThrow(e)
  })
})
