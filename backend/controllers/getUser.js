const asyncMiddleware = require('../middleware/asyncHandler')

const getUserFactory = elite2Api => {
  const getUser = asyncMiddleware(async (req, res) => {
    const { username } = req.query
    const data = await elite2Api.getUser(res.locals, username)
    if (data.activeCaseLoadId) {
      const agency = await elite2Api.getAgencyDetails(res.locals, data.activeCaseLoadId)
      data.agencyDescription = agency.description
    }
    res.json(data)
  })

  return {
    getUser,
  }
}

module.exports = {
  getUserFactory,
}
