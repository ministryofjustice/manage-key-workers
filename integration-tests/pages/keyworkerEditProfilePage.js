const page = require('./page')

const editKeyworkerProfilePage = () =>
  page('Edit profile', {
    capacity: () => cy.get('#capacity'),
    keyworkerStatusSelect: () => cy.get('#status-select'),
    save: () => cy.get('.button-save').click(),
  })

export default {
  verifyOnPage: editKeyworkerProfilePage,
}
