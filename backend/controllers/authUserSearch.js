const log = require('../log')

const authUserSearchFactory = oauthApi => {
  const authUserSearch = async (req, res) => {
    const { nameFilter } = req.query
    log.debug('Performing auth user search')

    if (!nameFilter) {
      res.status(400)
      res.json([{ targetName: 'user', text: 'Enter a username or email address' }])
      return
    }

    try {
      const response = nameFilter.includes('@')
        ? await oauthApi.userSearch(res.locals, { nameFilter })
        : [await oauthApi.getUser(res.locals, { nameFilter })]

      if (!response) {
        res.status(404)
        res.json([{ targetName: 'user', text: `No accounts for email address ${nameFilter} found` }])
        return
      }

      res.json(response)
    } catch (e) {
      if (e.response && e.response.status && e.response.data) {
        res.status(e.response.status)
        res.json([{ targetName: 'user', text: e.response.data.error_description }])
      } else {
        throw e
      }
    }
  }

  return { authUserSearch }
}

module.exports = { authUserSearchFactory }
