const page = require('./page')

const offenderSearchPage = (keyworker) =>
  page(keyworker, {
    editProfileButton: () => cy.get('#editProfileButton'),
    updateAllocationButton: () => cy.get('#updateAllocationButton'),
    allocationSelect: (offenderNo) => cy.get(`#keyworker-select-${offenderNo}`),
  })

export default {
  verifyOnPage: offenderSearchPage,
}
