const log = require('../log')

const keyworkerUpdateFactory = keyworkerApi => {
  const keyworkerUpdate = async (req, res) => {
    const update = req.body.keyworker
    log.debug('Key worker update contents')
    const { staffId, agencyId } = req.query
    await keyworkerApi.keyworkerUpdate(res.locals, staffId, agencyId, update)
    log.debug('Response from keyworker update request')
    res.json({})
  }

  return {
    keyworkerUpdate,
  }
}

module.exports = {
  keyworkerUpdateFactory,
}
