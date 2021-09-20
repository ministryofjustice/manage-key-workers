const page = require('./page')

const offenderSearchPage = () =>
  page('Search for an offender', {
    search: () => cy.get('.button').click(),
    saveButton: () => cy.get('.button-save'),
    keyworkerSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
    housingLocations: () => cy.get('#housing-location-select option'),
    verifyPageReady() {
      this.housingLocations().its('length').should('be.gte', 0)
    },
  })

export default {
  verifyOnPage: offenderSearchPage,
}
