const page = require('./page')

const prisonStatsPage = (prison) =>
  page(prison, {
    numberOfActiveKeyworkers: () => cy.get("[data-qa='numberOfActiveKeyworkers-value']"),
    numberKeyworkerSessions: () => cy.get("[data-qa='numberKeyWorkerSessions-value']"),
    percentagePrisonersWithKeyworker: () => cy.get("[data-qa='percentagePrisonersWithKeyworker-value']"),
    numProjectedKeyworkerSessions: () => cy.get("[data-qa='numProjectedKeyworkerSessions-value']"),
    complianceRate: () => cy.get("[data-qa='complianceRate-value']"),
    avgNumDaysFromReceptionToAllocationDays: () => cy.get("[data-qa='avgNumDaysFromReceptionToAllocationDays-value']"),
    avgNumDaysFromReceptionToKeyWorkingSession: () =>
      cy.get("[data-qa='avgNumDaysFromReceptionToKeyWorkingSession-value']"),
    prisonerToKeyworkerRation: () => cy.get("[data-qa='prisonerToKeyworkerRation-value']"),
    setFromDate: (from) => {
      cy.get('#fromDate').click()
      cy.get('.fromDate th.rdtSwitch').click()
      cy.get('.fromDate th.rdtSwitch').click()
      cy.get(`.fromDate td[data-value=${from.get('year')}]`).click()
      cy.get(`.fromDate td[data-value=${from.get('month')}]`).click()
      cy.get(`.fromDate td.rdtDay:not(.rdtOld):not(.rdtNew)[data-value=${from.date()}]`).click()
    },
    setToDate: (to) => {
      cy.get('#toDate').click()
      cy.get('.toDate th.rdtSwitch').click()
      cy.get('.toDate th.rdtSwitch').click()
      cy.get(`.toDate td[data-value=${to.get('year')}]`).click()
      cy.get(`.toDate td[data-value=${to.get('month')}]`).click()
      cy.get(`.toDate td.rdtDay:not(.rdtOld):not(.rdtNew)[data-value=${to.date()}]`).click()
      cy.get('form button').click()
    },
  })

export default {
  verifyOnPage: prisonStatsPage,
}
