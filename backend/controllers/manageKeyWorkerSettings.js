module.exports = ({ keyworkerApi }) => {
  const renderTemplate = async (req, res, pageData = {}) => {
    const { errors = [], inputtedFormValues = {} } = pageData
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId)

    return res.render('manageKeyWorkerSettings', {
      errors,
      formValues: {
        allowAuto: inputtedFormValues.allowAuto || prisonStatus.autoAllocatedSupported,
        standardCapacity: (inputtedFormValues.standardCapacity || prisonStatus.capacityTier1).toString(),
        extendedCapacity: (inputtedFormValues.extendedCapacity || prisonStatus.capacityTier2).toString(),
        frequency: Number(inputtedFormValues.frequency || prisonStatus.kwSessionFrequencyInWeeks),
      },
    })
  }

  const index = (req, res) => renderTemplate(req, res)

  const post = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allowAuto, standardCapacity, extendedCapacity, frequency } = req.body
    const { supported } = await keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId)

    if (Number(standardCapacity) > Number(extendedCapacity)) {
      return renderTemplate(req, res, {
        errors: [
          {
            href: '#extendedCapacity',
            text: 'Capacity Tier 2 must be equal to or greater than Capacity Tier 1',
          },
        ],
        inputtedFormValues: req.body,
      })
    }

    const capacity = `${standardCapacity},${extendedCapacity}`

    if (allowAuto === 'yes') {
      await keyworkerApi.enableAutoAllocationAndMigrate(res.locals, activeCaseLoadId, !supported, capacity, frequency)
    } else {
      await keyworkerApi.enableManualAllocationAndMigrate(res.locals, activeCaseLoadId, !supported, capacity, frequency)
    }

    return res.redirect('/')
  }

  return { index, post }
}
