const { serviceCheckFactory } = require('../controllers/healthCheck')

const service = (name, url) => {
  const check = serviceCheckFactory(name, url)
  return () =>
    check()
      .then((result) => ({ name, status: 'UP', message: result }))
      .catch((err) => ({ name, status: 'ERROR', message: err }))
}

const gatherCheckInfo = (total, currentValue) => ({ ...total, [currentValue.name]: currentValue.message })

const getBuild = () => {
  try {
    // eslint-disable-next-line import/no-unresolved,global-require
    return require('../../build-info.json')
  } catch (ex) {
    return null
  }
}

const addAppInfo = (result) => {
  const buildInformation = getBuild()
  const buildInfo = {
    uptime: process.uptime(),
    build: buildInformation,
    version: (buildInformation && buildInformation.buildNumber) || 'Not available',
  }

  return { ...result, ...buildInfo }
}

module.exports = function healthcheckFactory(
  authUrl,
  elite2Url,
  keyworkerUrl,
  tokenverificationUrl,
  complexityOfNeedUrl
) {
  const checks = [
    service('auth', `${authUrl}/health/ping`),
    service('elite2', `${elite2Url}/health/ping`),
    service('keyworker', `${keyworkerUrl}/health/ping`),
    service('tokenverification', `${tokenverificationUrl}/health/ping`),
    service('complexityOfNeed', `${complexityOfNeedUrl}/health`),
  ]

  return (callback) =>
    Promise.all(checks.map((fn) => fn())).then((checkResults) => {
      const allOk = checkResults.every((item) => item.status === 'UP') ? 'UP' : 'DOWN'
      const result = {
        name: 'manage-key-workers',
        status: allOk,
        api: checkResults.reduce(gatherCheckInfo, {}),
      }
      callback(null, addAppInfo(result))
    })
}
