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

  it('should return 400 if missing query', async () => {
    await authUserSearch({ query: {} }, res)

    expect(res.json).toBeCalledWith('Enter a username or email address')
    expect(res.status).toBeCalledWith(400)
  })
})
