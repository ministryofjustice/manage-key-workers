const log = require('../log')

const keyworkerProfileFactory = (keyworkerApi) => {
  const keyworkerProfile = async (req, res) => {
    const { staffId, agencyId } = req.query
    const keyworker = await keyworkerApi.keyworker(res.locals, staffId, agencyId)
    log.debug('Response from keyworker request')
    res.json(keyworker)
  }

  return {
    keyworkerProfile,
  }
}

module.exports = {
  keyworkerProfileFactory,
}
