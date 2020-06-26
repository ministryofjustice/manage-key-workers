const page = require('./page')

const homePage = () =>
  page('Manage key workers', {
    keyworkerSettingsLink: () => cy.get('#keyworker_settings_link'),
    autoAllocateLink: () => cy.get('#auto_allocate_link'),
  })

export default {
  verifyOnPage: homePage,
}
