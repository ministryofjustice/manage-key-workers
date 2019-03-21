const log = require('../log')

const authUserSearchFactory = oauthApi => {
  const authUserSearch = async (req, res) => {
    const { nameFilter } = req.query
    log.debug('Performing auth user search')

    if (!nameFilter) {
      const error = new Error('Missing name filter on search')
      error.response = { data: { status: 400, error_description: 'Enter a username or email address' } }
      throw error
    }

    const response = nameFilter.includes('@')
      ? await oauthApi.userSearch(res.locals, { nameFilter })
      : [await oauthApi.getUser(res.locals, { nameFilter })]

    if (!response) {
      const error = new Error('No results returned from search')
      error.response = { data: { status: 404, error_description: `No accounts for email address ${nameFilter} found` } }
      throw error
    }

    res.json(response)
  }

  return { authUserSearch }
}

module.exports = { authUserSearchFactory }
