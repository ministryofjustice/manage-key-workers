package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.*
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Caseload
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount

import static com.github.tomakehurst.wiremock.client.WireMock.*

class Elite2Api extends WireMockRule {

    Elite2Api() {
        super(18080)
    }

    void stubGetUserDetails(UserAccount user) {
        this.stubFor(
                get(urlPathEqualTo("/api/users/${user.username}"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([
                                staffId         : user.staffMember.id,
                                username        : user.username,
                                firstName       : user.staffMember.firstName,
                                lastName        : user.staffMember.lastName,
                                email           : 'itaguser@syscon.net',
                                activeCaseLoadId: 'LEI'
                        ]))))
    }

    void stubGetAgencyDetails(Caseload caseload) {
        this.stubFor(
                get(urlPathEqualTo("/api/agencies/caseload/${caseload.id}"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([[

                                    agencyId: caseload.id,
                                    description: caseload.description,
                                    agencyType: caseload.type

                        ]]))))
    }

    void stubGetAgencyDetailsMultipleAgencies(Caseload caseload) {
        this.stubFor(
                get("/api/agencies/caseload/${caseload.id}")
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[
                                {
                                    "agencyId": "AG1",
                                    "description": "Agency 1",
                                    "agencyType": "TYPE"
                                },
                                 {
                                    "agencyId": "AG2",
                                    "description": "Agency 2",
                                    "agencyType": "TYPE"
                                }]''')))
    }

    void stubGetAgencyDetailsEmptyResult(Caseload caseload) {
        this.stubFor(
                get("/api/agencies/caseload/${caseload.id}")
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[]''')))
    }

    void stubGetRoles() {
        this.stubFor(
                get('/api/access-roles')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[
                                {
                                    "roleCode": "LICENCE_CA",
                                    "roleName": "Licence Case Admin",
                                    "parentRoleCode": "LICENCE_ROLE"
                                },
                                {
                                    "roleCode": "OMIC_ADMIN",
                                    "roleName": "OMIC Admin"
                                },
                                {
                                    "roleCode": "MAINTAIN_ACCESS_ROLES",
                                    "roleName": "Maintain Roles"
                                },
                                {
                                    "roleCode": "KW_MIGRATION",
                                    "roleName": "Key worker Migration Priv"
                                },
                                {
                                    "roleCode": "NOMIS_BATCHLOAD",
                                    "roleName": "Nomis Batchloader"
                                },
                                {
                                    "roleCode": "USER_ADMIN",
                                    "roleName": "User Admin"
                                }
                            ]''')))
                                }

    void stubGetRolesIncludingAdminRoles() {
        this.stubFor(
                get('/api/access-roles?includeAdmin=true')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''[
                                {
                                    "roleCode": "LICENCE_CA",
                                    "roleName": "Licence Case Admin",
                                    "parentRoleCode": "LICENCE_ROLE",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "OMIC_ADMIN",
                                    "roleName": "OMIC Admin",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "MAINTAIN_ACCESS_ROLES",
                                    "roleName": "Maintain Roles",
                                    "roleFunction": "GENERAL"
                                },
                                {
                                    "roleCode": "KW_MIGRATION",
                                    "roleName": "Key worker Migration Priv",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "NOMIS_BATCHLOAD",
                                    "roleName": "Nomis Batchloader",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "USER_ADMIN",
                                    "roleName": "User Admin",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "ANOTHER_ADMIN_ROLE",
                                    "roleName": "Another admin role",
                                    "roleFunction": "ADMIN"
                                },
                                {
                                    "roleCode": "ANOTHER_GENERAL_ROLE",
                                    "roleName": "Another general role",
                                    "roleFunction": "GENERAL"
                                }
                            ]''')))
    }


    void stubUserSearch(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/users/caseload/${agencyLocation.id}"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(UserSearchResponse.getResponse())))
    }

    void stubUserSearchAdmin(Integer page) {
        this.stubFor(
                get(urlPathEqualTo("/api/users"))
                        .withHeader('page-offset', equalTo((page * 10).toString()))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withHeader('total-records', "30")
                                .withBody(UserSearchResponse.pagedResponse(page))))
    }

    void stubUserLocalAdministratorSearch() {
        this.stubFor(
                get(urlPathEqualTo("/api/users/local-administrator/available"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(UserSearchResponse.getResponse())))
    }

    void stubUserLocalAdministratorSearch(Integer page) {
        this.stubFor(
                get(urlPathEqualTo("/api/users/local-administrator/available"))
                        .withHeader('page-offset', equalTo((page * 10).toString()))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withHeader('total-records', "30")
                                .withBody(UserSearchResponse.pagedResponse(page))))
    }

    void stubGetNWEBAccessRolesForUserAndCaseload(String username, boolean withOmicAdmin) {

        this.stubFor(
                get(urlPathEqualTo("/api/users/${username}/access-roles/caseload/NWEB"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(withOmicAdmin ? RolesResponse.getResponse() : RolesResponse.withoutOmicAdmin())))
    }

    void stubGetNWEBAccessRolesForUserAndCaseloadForAdminUser(String username, boolean withOmicAdmin) {

        this.stubFor(
                get("/api/users/${username}/access-roles/caseload/NWEB?includeAdmin=true")
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(withOmicAdmin ? RolesResponse.getResponse() : RolesResponse.withoutOmicAdmin())))
    }

    void stubRemoveNWEBRole(String username, String roleCode) {

        this.stubFor(
                delete(urlPathEqualTo("/api/users/${username}/caseload/NWEB/access-role/${roleCode}"))
                        .willReturn(
                        aResponse()
                                .withStatus(200)))
    }

    void stubAddNWEBRole(String username, String roleCode) {

        this.stubFor(
                put(urlPathEqualTo("/api/users/${username}/caseload/NWEB/access-role/${roleCode}"))
                        .willReturn(
                        aResponse()
                                .withStatus(201)))
    }



    void stubGetMyCaseloads(List<Caseload> caseloads) {
        stubGetMyCaseloads(caseloads, Caseload.LEI.id)
    }

    void stubGetMyCaseloads(List<Caseload> caseloads, caseload) {
        def json = new JsonBuilder()
        json caseloads, { cl ->
            caseLoadId cl.id
            description cl.description
            type cl.type
            caseloadFunction 'DUMMY'
            currentlyActive cl.id == caseload
        }

        this.stubFor(
                get('/api/users/me/caseLoads')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
                ))
    }

    void stubGetMyLocations(List<Location> locations) {

        JsonBuilder json = new JsonBuilder()
        json locations, {
            locationId it.locationId
            locationType it.locationType
            description it.description
            agencyId it.agencyId
            if (it.currentOccupancy != null) currentOccupancy it.currentOccupancy
            locationPrefix it.locationPrefix
            if (it.userDescription) userDescription it.userDescription
        }

        this.stubFor(
                get('/api/users/me/locations')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
        ))
    }

    void stubOffenderSentenceResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post(urlPathEqualTo("/api/offender-sentences"))
                        .willReturn(aResponse()
                        .withBody(OffenderSentencesResponse.response)
                        .withStatus(200))
        )
    }

    void stubEnableNewNomisResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                put(urlPathEqualTo("/api/users/add/default/${agencyLocation.id}"))
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubCaseNoteUsageResponse() {
        this.stubFor(
                get(urlPathMatching("/api/case-notes/usage?.*"))
                        .willReturn(aResponse()
                        .withBody(CaseNoteUsageResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderAssessmentResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post(urlPathEqualTo("/api/offender-assessments/csra/list"))
                        .willReturn(aResponse()
                        .withBody(OffenderAssessmentsResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_5_results)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchLargeResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .withHeader('page-limit', equalTo('3000'))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_55_results)
                        .withStatus(200))
        )
    }

    void stubEmptyOffenderSearchResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .willReturn(aResponse()
                        .withBody("[]")
                        .withStatus(200))
        )
    }

    void stubHealth() {
        this.stubFor(
            get('/ping')
                .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'plain/text')
                    .withBody("pong")))
    }

    void stubErrorWithMessage(url, status, message) {
        this.stubFor(
                get(urlPathEqualTo(url))
                        .willReturn(
                        aResponse()
                                .withStatus(status)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([
                                    status         : status,
                                    userMessage        : message]))))
    }

    void stubSetActiveCaseload() {
        this.stubFor(
                put(urlPathEqualTo("/api/users/me/activeCaseLoad"))
                        .willReturn(aResponse().withStatus(200)))
    }
}
