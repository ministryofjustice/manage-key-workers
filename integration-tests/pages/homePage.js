const page = require('./page')

const homePage = () =>
  page('Manage key workers', {
    keyworkerSettingsLink: () => cy.get('[data-test="establishment-key-worker-settings"]'),
    keyworkerSettings: () => cy.get('[data-test="key-worker-settings"]'),
  })

export default {
  verifyOnPage: homePage,
}
