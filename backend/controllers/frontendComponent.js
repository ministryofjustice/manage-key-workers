const frontendComponentFactory = (frontendComponentApi) => {
  const getFeComponents = async (req, res) => {
    const response = await frontendComponentApi.getComponents(res.locals, ['header', 'footer'])
    res.json(response)
  }

  return {
    getFeComponents,
  }
}

module.exports = {
  frontendComponentFactory,
}
