const prisonerSearchApiFactory = (client) => {
  const mapPrisoner = (prisoner) => ({
    ...prisoner,
    // for backward compatibility - treat bookingId as a number
    bookingId: Number(prisoner.bookingId),
    offenderNo: prisoner.prisonerNumber,
    agencyId: prisoner.prisonId,
    assignedLivingUnitDesc: prisoner.cellLocation,
  })

  const searchOffendersPaginated = async (context, prisonId, locationPrefix, pageRequest) => {
    const response = await client.get(
      context,
      `/prison/${prisonId}/prisoners?cellLocationPrefix=${locationPrefix}-&page=${pageRequest.page}&size=${pageRequest.pageSize}`
    )
    const data = response.body
    context.totalElements = data.totalElements
    context.pageOffset = data.number * data.size

    return data.content.map(mapPrisoner)
  }

  const searchOffenders = async (context, keywords, prisonId, resultsLimit) => {
    const response = await client.get(
      context,
      `/prison/${prisonId}/prisoners?term=${encodeURIComponent(keywords)}&size=${resultsLimit}`,
      resultsLimit
    )
    const data = response.body
    return data.content.map(mapPrisoner)
  }

  const getOffenders = async (context, prisonerNumbers) => {
    const response = await client.post(context, '/prisoner-search/prisoner-numbers', { prisonerNumbers })
    return response.body.map(mapPrisoner)
  }

  return { searchOffenders, searchOffendersPaginated, getOffenders }
}

module.exports = { prisonerSearchApiFactory }
