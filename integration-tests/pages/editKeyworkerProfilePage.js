const page = require('./page')

const editKeywokerProfilePage = () =>
  page('Edit profile', {
    capacity: () => cy.get('#capacity'),
    keyworkerStatusOptions: () => cy.get('#status-select option'),
    parentPageLink: () => cy.get("[data-qa='breadcrumb-parent-page-link']"),
  })

export default {
  verifyOnPage: editKeywokerProfilePage,
}
