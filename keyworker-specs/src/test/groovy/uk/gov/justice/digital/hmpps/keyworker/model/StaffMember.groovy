package uk.gov.justice.digital.hmpps.keyworker.model

import static uk.gov.justice.digital.hmpps.keyworker.model.Caseload.*

enum StaffMember {

    SM_1(-1, NWEB, NWEB, 'User', 'Elite2', 'API'),
    SM_2(-2, LEI, LEI, 'User', 'API', 'ITAG'),
    SM_3(-3, LEI, LEI, 'User', 'HPA', null),
    SM_4(-4, MUL, MUL, 'User', 'Test', null),
    SM_5(-5, LEI, LEI, 'User', 'Another', 'Test'),
    SM_6(-6, MDI, MDI, 'Officer1', 'Wing', null),
    SM_7(-7, BXI, BXI, 'Officer2', 'Wing', null),
    SM_8(-8, WAI, WAI, 'Officer3', 'Wing', null),
    SM_9(-9, SYI, SYI, 'Officer4', 'Wing', null),
    SM_10(-10, LEI, LEI, 'Officer', 'Ex', null, false)

    Integer id
    String lastName
    String middleName
    String firstName
    Caseload assginedCaseload
    Caseload workingCaseload
    Boolean active

    StaffMember(Integer id, Caseload assignedCaseload, Caseload workingCaseload, String lastName, String firstName, String middleName, Boolean active = true) {
        this.id = id
        this.lastName = lastName
        this.middleName = middleName
        this.firstName = firstName
        this.assginedCaseload = assginedCaseload
        this.workingCaseload = workingCaseload
        this.active = active
    }
}