const userCaseloadsFactory = elite2Api => {
  const userCaseloads = async (req, res) => {
    const data = await elite2Api.userCaseLoads(res.locals)
    res.json(data)
  }

  return {
    userCaseloads,
  }
}

module.exports = {
  userCaseloadsFactory,
}
