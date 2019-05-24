const MockAdapter = require('axios-mock-adapter')
const clientFactory = require('./oauthEnabledClient')
const { healthApiFactory } = require('./healthApi')

describe('healthApi', () => {
  const client1 = clientFactory({ baseUrl: 'http://localhost:12345' })
  const client2 = clientFactory({ baseUrl: 'http://localhost:12345' })

  const mock1 = new MockAdapter(client1.axiosInstance)
  const mock2 = new MockAdapter(client2.axiosInstance)

  const healthApi = healthApiFactory(client1, client2)

  afterEach(() => {
    mock1.reset()
    mock2.reset()
  })

  it('should return true if both apis are up', async () => {
    mock1.onGet('/health').reply(200, {})
    mock2.onGet('/health').reply(200, {})
    expect(await healthApi.isUp()).toBe(true)
  })

  it('should return false if first api is unreachable', async () => {
    mock1.onGet('/health').networkError()
    mock2.onGet('/health').reply(200, {})
    expect(await healthApi.isUp()).toBe(false)
  })

  it('should return false if second api is unreachable', async () => {
    mock1.onGet('/health').reply(200, {})
    mock2.onGet('/health').networkError()
    expect(await healthApi.isUp()).toBe(false)
  })

  it('should return false if first api times out', async () => {
    mock1.onGet('/health').timeout()
    mock2.onGet('/health').reply(200, {})
    expect(await healthApi.isUp()).toBe(false)
  })

  it('should return false if first api returns 500', async () => {
    mock1.onGet('/health').reply(500, {})
    mock2.onGet('/health').reply(200, {})
    expect(await healthApi.isUp()).toBe(false)
  })
})
