const healthApiFactory = (elite2ApiClient, keyworkerApiClient) => {
  const isUp = () =>
    Promise.all([
      elite2ApiClient.get({}, 'ping').then(() => true, () => false),
      keyworkerApiClient.get({}, 'ping').then(() => true, () => false),
    ]).then(values => values.reduce((acc, value) => acc && value), true)

  return {
    isUp,
  }
}

module.exports = {
  healthApiFactory,
}
