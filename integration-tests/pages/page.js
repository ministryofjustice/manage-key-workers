export default (name, pageObject = {}) => {
  const checkOnPage = () => cy.get('h1').contains(name)
  const parentPageLink = () => cy.get("[data-qa='breadcrumb-parent-page-link']")
  const errorSummary = () => cy.get('.error-summary')
  checkOnPage()
  return { ...pageObject, checkStillOnPage: checkOnPage, parentPageLink, errorSummary }
}
