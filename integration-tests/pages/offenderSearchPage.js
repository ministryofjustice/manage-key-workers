const page = require('./page')

const offenderSearchPage = () =>
  page('Search for an offender', {
    search: () => cy.get('#searchButton').click(),
    saveButton: () => cy.get('.button-save'),
    keyworkerSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
    housingLocations: () => cy.get('#housing-location-select option'),
    verifyPageReady() {
      this.housingLocations().its('length').should('be.gte', 0)
    },
    keyworkerLink: (userId) => cy.get(`a[href='/key-worker/${userId}']`).eq(0),
    allocationStatusSelect: () => cy.get('#allocation-status-select'),
    resultRows: () => cy.get('tbody tr'),
    assignNewKeyworkeSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
    messageBar: () => cy.get('#messageBar'),
  })

export default {
  verifyOnPage: offenderSearchPage,
}
