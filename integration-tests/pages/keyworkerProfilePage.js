const page = require('./page')

const offenderSearchPage = (keyworker) =>
  page(keyworker, {
    editProfileButton: () => cy.get('#editProfileButton'),
    updateAllocationButton: () => cy.get('#updateAllocationButton'),
    allocationSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
    allocationCount: () => cy.get(`#allocationCount`),
    allocationSelectOptions: (offenderNo) => cy.get(`#keyworker-select-${offenderNo} option`),
    verifyAllocationStyleGreen: () => cy.get("div[class='numberCircleGreen']").should('exist'),
    getResultElement: (row, column) =>
      cy
        .get('table tbody tr')
        .eq(row - 1)
        .find('td')
        .eq(column - 1),
    clickEditProfileButton: () => cy.get('#editProfileButton').click(),
    status: () => cy.get('#keyworker-status'),
    messageBar: () => cy.get('#messageBar'),
    statsColumn: (column) => cy.get('[data-qa="keyworker-stat"]').eq(column - 1),
    statsColumnTitle(column) {
      return this.statsColumn(column).find('h2')
    },
    statsColumnValue(column) {
      return this.statsColumn(column).find('p').eq(0)
    },
    statsColumnMessage(column) {
      return this.statsColumn(column).find('p').eq(1)
    },
    statsHeading: () => cy.get('[data-qa="keyworker-stat-heading"]'),
  })

export default {
  verifyOnPage: offenderSearchPage,
}
