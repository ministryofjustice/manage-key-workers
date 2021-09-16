const page = require('./page')

const keyworkerEditProfileConfirmPage = () =>
  page('Update status', {
    status: () => cy.get('#keyworker-status'),
    inactiveWarning: () => cy.get('#keyworker-status'),
  })

export default {
  verifyOnPage: keyworkerEditProfileConfirmPage,
}
