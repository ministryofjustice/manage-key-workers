/**
 * Return an frontendComponentApi built using the supplied configuration.
 * @param client
 * @returns a configured frontendComponentApi instance
 */
const frontendComponentApiFactory = (client) => {
  const get = async (context, url) => {
    const response = await client.get(context, url)
    return response.body
  }

  const getComponents = (context, components) =>
    get(
      { ...context, customRequestHeaders: { 'x-user-token': context.access_token } },
      `/components?component=${components.join('&component=')}`
    )

  return {
    getComponents,
  }
}

module.exports = { frontendComponentApiFactory }
