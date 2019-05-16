const manualAllocationAndMigrateFactory = keyworkerApi => {
  const enableManualAllocationAndMigrate = async (req, res) => {
    const { agencyId } = req.query
    const update = req.body
    const response = await keyworkerApi.enableManualAllocationAndMigrate(
      res.locals,
      agencyId,
      update.migrate,
      update.capacity,
      update.frequency
    )
    res.json(response)
  }

  return {
    enableManualAllocationAndMigrate,
  }
}

module.exports = {
  manualAllocationAndMigrateFactory,
}
