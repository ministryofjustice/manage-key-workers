module.exports = (frontendComponentApi) => async (req, res, next) => {
  try {
    const response = await frontendComponentApi.getComponents(res.locals, ['header', 'footer'])
    const { header, footer } = response

    res.locals.feComponents = {
      header: header.html,
      footer: footer.html,
      cssIncludes: [...header.css, ...footer.css],
      jsIncludes: [...header.javascript, ...footer.javascript],
    }

    next()
  } catch (error) {
    next()
  }
}
