const getUserFactory = elite2Api => {
  const getUser = async (req, res) => {
    const { username } = req.query
    const data = await elite2Api.getUser(res.locals, username)

    /* user may be associated with a different agency to the one in context - retrieve the agency description(s)  */
    if (data.activeCaseLoadId) {
      const agencyArray = await elite2Api.getAgencyDetails(res.locals, data.activeCaseLoadId)
      let description = ''
      agencyArray.forEach(element => {
        description += `${element.description}, `
      })
      if (description !== '') {
        description = description.slice(0, -2)
        data.agencyDescription = description
      }
    }

    res.json(data)
  }

  return {
    getUser,
  }
}

module.exports = {
  getUserFactory,
}
