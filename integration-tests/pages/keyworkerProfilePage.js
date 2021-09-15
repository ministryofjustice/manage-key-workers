const page = require('./page')

const offenderSearchPage = (keyworker) =>
  page(keyworker, {
    editProfileButton: () => cy.get('#editProfileButton'),
    updateAllocationButton: () => cy.get('#updateAllocationButton'),
    allocationSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
    allocationCount: () => cy.get(`#allocationCount`),
    allocationSelectOptions: (offenderNo) => cy.get(`#keyworker-select-${offenderNo} option`),
    verifyAllocationStyleGreen: () => cy.get("div[class='numberCircleGreen']").should('exist'),
  })

export default {
  verifyOnPage: offenderSearchPage,
}
