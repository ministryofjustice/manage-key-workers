const page = require('./page')

const keyworkerSearchPage = () =>
  page('Search for a key worker', {
    searchTextInput: () => cy.get('#search-text'),
    search: () => cy.get('.button').click(),
    clickKeyworker: (userId) => cy.get(`#key_worker_${userId}_link`).click(),
    searchAndClickKeyworker(userId) {
      this.search()
      this.clickKeyworker(userId)
    },
    searchRows: () => cy.get('table tbody tr'),
    getHeaderElement: (row) => cy.get('table thead th').eq(row - 1),
    selectStatus: (value) => cy.get('select').select(value),
    errorSummary: () => cy.get('.error-summary'),
  })

export default {
  verifyOnPage: keyworkerSearchPage,
}
