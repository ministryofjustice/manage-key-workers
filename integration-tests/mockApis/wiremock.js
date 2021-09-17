const superagent = require('superagent')

const url = 'http://localhost:9191/__admin'

const stubFor = (mapping) => superagent.post(`${url}/mappings`).send(mapping)

const getRequests = () => superagent.get(`${url}/requests`)

const getMatchingRequests = (body) => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = () => Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const getFor = ({ body, urlPattern, urlPath }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern,
      urlPath,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: body,
    },
  })

const verifyRequest = ({ requestUrl, requestUrlPattern, method, body, queryParameters }) => {
  const bodyPatterns =
    (body && {
      bodyPatterns: [{ equalToJson: JSON.stringify(body) }],
    }) ||
    {}
  return superagent.post(`${url}/requests/count`).send({
    method,
    urlPattern: requestUrlPattern,
    url: requestUrl,
    ...bodyPatterns,
    queryParameters,
  })
}

module.exports = {
  stubFor,
  getRequests,
  getMatchingRequests,
  resetStubs,
  getFor,
  verifyRequest,
}
