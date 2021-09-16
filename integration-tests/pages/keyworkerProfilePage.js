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
  })

export default {
  verifyOnPage: offenderSearchPage,
}
