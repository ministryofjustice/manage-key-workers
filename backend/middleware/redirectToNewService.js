const REDIRECT_ENABLED_PRISONS = process.env.REDIRECT_ENABLED_PRISONS ?? ''

module.exports = () => (req, res, next) => {
  const activeCaseLoadId = req.session?.userDetails?.activeCaseLoadId
  if (activeCaseLoadId && REDIRECT_ENABLED_PRISONS.includes(activeCaseLoadId)) {
    res.redirect(`${process.env.ALLOCATIONS_UI_URL}/key-worker`)
  } else {
    next()
  }
}
