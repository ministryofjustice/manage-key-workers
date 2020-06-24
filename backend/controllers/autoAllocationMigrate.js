const log = require('../log')

const autoAllocationAndMigrateFactory = (keyworkerApi) => {
  const enableAutoAllocationAndMigrate = async (req, res) => {
    const { agencyId } = req.query
    const update = req.body

    const response = await keyworkerApi.enableAutoAllocationAndMigrate(
      res.locals,
      agencyId,
      update.migrate,
      update.capacity,
      update.frequency
    )
    log.debug('Response from enableAutoAllocationAndMigrate')
    res.json(response)
  }

  return {
    enableAutoAllocationAndMigrate,
  }
}

module.exports = {
  autoAllocationAndMigrateFactory,
}
