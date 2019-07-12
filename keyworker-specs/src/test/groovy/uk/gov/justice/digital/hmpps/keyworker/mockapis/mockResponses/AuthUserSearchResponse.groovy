package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class AuthUserSearchResponse {

    static getUsernameResponse(enabled = true) { """
        {"username": "AUTH_ADM", "email": "auth_test2@digital.justice.gov.uk", "enabled": ${enabled}, "locked": false, "verified": false, "firstName": "Auth", "lastName": "Adm"}
""" }

    static emailResponse = """[
        {"username": "AUTH_ADM", "email": "auth_test2@digital.justice.gov.uk", "enabled": true, "locked": false, "verified": false, "firstName": "Auth", "lastName": "Adm"},
        {"username": "AUTH_EXPIRED", "email": "auth_test2@digital.justice.gov.uk", "enabled": true, "locked": false, "verified": false, "firstName": "Auth", "lastName": "Expired"}
]"""


    static rolesResponse = """[
        {"roleCode": "GLOBAL_SEARCH", "roleName": "Global Search"},
        {"roleCode": "LICENCE_RO", "roleName": "Licence Responsible Officer"}
]"""

    static allRolesResponse = """[
        {"roleCode": "GLOBAL_SEARCH", "roleName": "Global Search"},
        {"roleCode": "LICENCE_RO", "roleName": "Licence Responsible Officer"},
        {"roleCode": "LICENCE_VARY", "roleName": "Licence Vary"}
]"""

    static allGroupsResponse = """[
        {"groupCode": "GROUP_1", "groupName": "Site 1 - Group 1"},
        {"groupCode": "GROUP_2", "groupName": "Site 1 - Group 2"},
        {"groupCode": "GROUP_3", "groupName": "Site 1 - Group 3"}
]"""
}
