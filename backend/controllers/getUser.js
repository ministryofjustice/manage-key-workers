const asyncMiddleware = require('../middleware/asyncHandler')

const getUserFactory = elite2Api => {
  const getUser = asyncMiddleware(async (req, res) => {
    const { username } = req.query
    const data = await elite2Api.getUser(res.locals, username)
    res.json(data)
  })

  return {
    getUser,
  }
}

module.exports = {
  getUserFactory,
}
