const page = require('./page')

const homePage = () =>
  page('Key workers', {
    keyworkerSettingsLink: () => cy.get('[data-test="establishment-key-worker-settings"]'),
    keyworkerSettings: () => cy.get('[data-test="key-worker-settings"]'),
  })

export default {
  verifyOnPage: homePage,
}
