package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class RolesResponse {

    static response = '''
[
    {
        "roleId": 180146,
        "roleCode": "MAINTAIN_ACCESS_ROLES",
        "roleName": "Maintain Roles",
        "caseloadId": "NWEB"
    },
    {
        "roleId": 178124,
        "roleCode": "OMIC_ADMIN",
        "roleName": "OMIC Admin",
        "caseloadId": "NWEB"
    }
]
'''


    static withoutOmicAdmin() {
        return """
[
    {
        "roleId": 180146,
        "roleCode": "MAINTAIN_ACCESS_ROLES",
        "roleName": "Maintain Roles",
        "caseloadId": "NWEB"
    }
]
"""
    }
}
