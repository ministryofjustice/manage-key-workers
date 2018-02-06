const gatewayApi = require('../gateway-api');
const session = require('../session');
const axios = require('axios');
const MockAdaptor = require('axios-mock-adapter');
const log = require('../log');

let mock = new MockAdaptor(axios);

const req = {
  headers: {
    jwt: session.newJWT({
      token: 'hello',
      refreshToken: 'world'
    })
  }
};

log.debug = jest.fn();
log.info = jest.fn();

describe('Gateway api', () => {
  it('should retry request with a new token once expired ', async () => {
    const newTokenData = {
      token: 'token',
      refreshToken: 'refreshToken'
    };

    mock.onGet('/users/me').replyOnce(401);
    mock.onPost('/users/token').reply(200, newTokenData);
    mock.onGet('/users/me').replyOnce(200);

    gatewayApi.retryRequest = jest.fn();

    await gatewayApi.getRequest({ req, url: 'users/me' });

    expect(gatewayApi.retryRequest.mock.calls[0][0].headers.authorization)
      .toBe(newTokenData.token);
  });
});
