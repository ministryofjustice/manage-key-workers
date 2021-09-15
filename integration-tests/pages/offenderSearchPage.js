const page = require('./page')

const offenderSearchPage = () =>
  page('Search for an offender', {
    verifyPageReady: () => cy.get('#housing-location-select option').its('length').should('be.gte', 0),
    search: () => cy.get('.button').click(),
    saveButton: () => cy.get('.button-save'),
    keyworkerSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
  })

export default {
  verifyOnPage: offenderSearchPage,
}
