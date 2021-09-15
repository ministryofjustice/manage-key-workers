const page = require('./page')

const keyworkerSearchPage = () =>
  page('Search for a key worker', {
    search: () => cy.get('.button').click(),
    clickKeyworker: (userId) => cy.get(`#key_worker_${userId}_link`).click(),
    searchAndClickKeyworker(userId) {
      this.search()
      this.clickKeyworker(userId)
    },
  })

export default {
  verifyOnPage: keyworkerSearchPage,
}
