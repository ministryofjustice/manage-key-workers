

package uk.gov.justice.digital.hmpps.keyworker.model;

public enum OmsRole {

    WING_OFF(-2, 'Wing Officer', 'WING_OFF',null),
    LICENCE_CA(-100, 'Case Admin', 'LICENCE_CA',null),
    LICENCE_RO(-101, 'Responsible Officer', 'LICENCE_RO',null),
    KW_ADMIN(-201, 'Keyworker Admin', 'KW_ADMIN',null)

    Integer id
    String name
    String code
    OmsRole parent

    OmsRole(int id, String name, String code, OmsRole parent) {
        this.id = id
        this.name = name
        this.code = code
        this.parent = parent
    }
}
