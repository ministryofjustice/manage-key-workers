const page = require('./page')

const keyworkerEditProfileConfirmPage = () =>
  page('Update status', {
    status: () => cy.get('#keyworker-status'),
    inactiveWarning: () => cy.get('#keyworker-status'),
    annualLeaveDatePicker: () => cy.get('.datePickerInput'),
    allocationRadios: () => cy.get('[type="radio"]'),
    save: () => cy.get('.button-save').click(),
    errorMessage: () => cy.get('.error-message'),
  })

export default {
  verifyOnPage: keyworkerEditProfileConfirmPage,
}
