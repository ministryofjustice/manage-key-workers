const express = require('express')
const path = require('path')

const router = express.Router()

const setup = () => {
  // These are routes defined in the react router
  // They are listed here so the express app also knows about
  // them and knows to pass them onto the react router
  // This is needed in order to implement a page not found behaviour.
  router.get(
    [
      '/',
      '/unauthorised',
      '/key-worker-statistics',
      '/keyworkerReports',
      '/offender-search',
      '/offender-search/results',
      '/offender-history/:offenderNo',
      '/unallocated',
      '/unallocated/provisional-allocation',
      '/key-worker-search',
      '/key-worker-search/results',
      '/key-worker/:staffId',
      '/key-worker/:staffId/edit',
      '/key-worker/:staffId/confirm-edit',
      '/manage-key-worker-settings',
    ],
    (req, res) => {
      res.sendFile(path.join(__dirname, '../build/index.html'))
    }
  )

  return router
}

module.exports = (dependencies) => setup(dependencies)
