package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.AllocatedPage
import uk.gov.justice.digital.hmpps.keyworker.pages.UnallocatedPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class AutoAllocationSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "Unallocated page is displayed correctly"() {
        given: "I am at the key worker home page"
        fixture.loginAs(ITAG_USER)

        when: "I go to the Unallocated page"
        fixture.toUnallocatedPage()

        then: "data should display as expected"
        at UnallocatedPage
        rows.size() == 9
        //  use to provide screenshot -
        report "Unallocatedsdar"
        allocateButton.text() == 'Allocate'
        table.find("tr", 1).find("td", 0).text() == 'Bradley, Neil'
        table.find("tr", 1).find("a", href: endsWith('/offenders/A6676RS/quick-look')).size() == 1
        table.find("tr", 1).find("td", 1).text() == 'A6676RS'
        table.find("tr", 1).find("td", 2).text() == 'H-1'
        table.find("tr", 1).find("td", 3).text() == '--'
        table.find("tr", 1).find("td", 4).text() == '--'

        table.find("tr", 3).find("td", 2).text() == 'H-3'
        table.find("tr", 3).find("td", 3).text() == '02/02/2022'
        table.find("tr", 3).find("td", 4).text() == 'ABC'

        table.find("tr", 9).find("td", 1).text() == 'Z0018ZZ'
        table.find("tr", 9).find("td", 3).text() == '19/09/2019'
    }

    def "Unallocated page with no data is displayed correctly"() {
        given: "I am at the key worker home page"
        fixture.loginAs(ITAG_USER)

        when: "I go to the Unallocated page"
        fixture.toUnallocatedPageNoData()

        then: "No data should be displayed"
        at UnallocatedPage
        $('table tbody tr').size() == 0
        $('button').size() == 0
        $("div.font-small").text() == 'No prisoners found'
    }

    def "Allocated page is displayed correctly"() {
        given: "I am at the Unallocated page"
        fixture.loginAs(ITAG_USER)
        fixture.toUnallocatedPage()

        when: "I Allocate"
        at UnallocatedPage
        rows.size() == 9
        fixture.toAllocatedPage(false)

        then: "Allocations should be displayed as expected"
        at AllocatedPage
        rows.size() == 9
        confirmButton.text() == 'Confirm allocation'
        cancelButton.text() == 'Cancel allocation'
        table.find("tr", 1).find("td", 0).text() == 'Bradley, Neil'
        table.find("tr", 1).find("a", href: endsWith('/offenders/A6676RS/quick-look')).size() == 1
        table.find("tr", 1).find("td", 1).text() == 'A6676RS'
        table.find("tr", 1).find("td", 2).text() == 'H-1'
        table.find("tr", 1).find("td", 3).text() == '--'
        table.find("tr", 1).find("td", 4).text() == '--'
        table.find("tr", 1).find("td", 5).text() == 'Cuser, Another (6)'
        table.find("tr", 1).find("option", 1).text() == 'Auser, Hpa (4)'
        table.find("tr", 1).find("option", 1).@value == '-3'
        table.find("tr", 1).find("option", 2).text() == 'Tuser, Test (5)'
        table.find("tr", 1).find("option", 2).@value == '-4'
        table.find("tr", 1).find("option", 3).text() == 'Duser, Api (9)'
        table.find("tr", 1).find("option", 3).@value == '-2'

        table.find("tr", 3).find("td", 2).text() == 'H-3'
        table.find("tr", 3).find("td", 3).text() == '02/02/2022'
        table.find("tr", 3).find("td", 4).text() == 'ABC'
        table.find("tr", 3).find("td", 5).text() == '-1 (no details available)'

        table.find("tr", 9).find("td", 1).text() == 'Z0018ZZ'
        table.find("tr", 9).find("td", 3).text() == '19/09/2019'
    }

    def "Allocated page with no keyworkers warning is displayed correctly"() {
        given: "I am at the Unallocated page"
        fixture.loginAs(ITAG_USER)
        fixture.toUnallocatedPage()

        when: "I Allocate with insufficient available keyworkers"
        at UnallocatedPage
        fixture.toAllocatedPage(true)

        then: "A warning should be displayed along with the successful allocations"
        at AllocatedPage
        warning == "No Key workers available for allocation. Please try allocating manually, adding more Key workers or raising their capacities."
        rows.size() == 9
        confirmButton.text() == 'Confirm allocation'
    }
}
