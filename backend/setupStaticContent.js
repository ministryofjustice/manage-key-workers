const express = require('express')
const path = require('path')

const router = express.Router()

module.exports = () => {
  router.use('/bundle.js', express.static(path.join(__dirname, '../build/bundle.js')))
  router.use('/static', express.static(path.join(__dirname, '../build/static')))
  router.use('/images', express.static(path.join(__dirname, '../build/images')))
  router.use('/styles', express.static(path.join(__dirname, '../build/styles')))

  const assetPaths = [
    '../node_modules/govuk-frontend/govuk/assets',
    '../node_modules/govuk-frontend',
    '../node_modules/@ministryofjustice/frontend',
  ]
  assetPaths.forEach((dir) => {
    router.use('/assets', express.static(path.join(__dirname, dir)))
  })

  return router
}
