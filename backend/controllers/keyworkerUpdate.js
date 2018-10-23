const asyncMiddleware = require('../middleware/asyncHandler')
const log = require('../log')

const keyworkerUpdateFactory = keyworkerApi => {
  const keyworkerUpdate = asyncMiddleware(async (req, res) => {
    const update = req.body.keyworker
    log.debug({ update }, 'Key worker update contents')
    const { staffId, agencyId } = req.query
    const response = await keyworkerApi.keyworkerUpdate(res.locals, staffId, agencyId, update)
    log.debug({ response }, 'Response from keyworker update request')
    res.json({})
  })

  return {
    keyworkerUpdate,
  }
}

module.exports = {
  keyworkerUpdateFactory,
}
