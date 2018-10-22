const healthApiFactory = (elite2ApiClient, keyworkerApiClient) => {
  const isUp = () =>
    Promise.all([
      elite2ApiClient.get({}, 'health').then(() => true, () => false),
      keyworkerApiClient.get({}, 'health').then(() => true, () => false),
    ]).then(values => values.reduce((acc, value) => acc && value), true)

  return {
    isUp,
  }
}

module.exports = {
  healthApiFactory,
}
