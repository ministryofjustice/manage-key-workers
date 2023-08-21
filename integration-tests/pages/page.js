export default (name, pageObject = {}) => {
  const checkOnPage = () => cy.get('h1').contains(name)
  const errorSummary = () => cy.get('.error-summary')
  checkOnPage()
  return { ...pageObject, checkStillOnPage: checkOnPage, errorSummary }
}
