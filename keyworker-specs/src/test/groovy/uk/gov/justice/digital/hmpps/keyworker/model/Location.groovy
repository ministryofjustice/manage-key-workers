package uk.gov.justice.digital.hmpps.keyworker.model

enum Location {
    BXI('BXI', 'BRIXTON', 'INST', 'Y'),
    BMI('BMI', 'BIRMINGHAM', 'INST', 'Y'),
    LEI('LEI', 'LEEDS', 'INST', 'Y'),
    WAI('WAI', 'THE WEARE', 'INST', 'Y'),
    OUT('OUT', 'OUTSIDE', 'INST', 'Y'),
    TRN('TRN', 'TRANSFER', 'INST', 'Y'),
    MUL('MUL', 'MUL', 'INST', 'Y'),
    ZZGHI('ZZGHI', 'GHOST', 'INST', 'N'),
    COURT1('COURT1', 'Court 1', 'CRT', 'Y'),
    ABDRCT('ABDRCT', 'Court 2', 'CRT', 'Y'),
    TRO('TRO', 'TROOM', 'INST', 'Y'),
    MDI('MDI', 'MOORLAND', 'INST', 'Y'),
    SYI('SYI', 'SHREWSBURY', 'INST', 'Y')

    String id
    String description
    String type
    Boolean active

    Location(String id, String description, String type, String active) {
        this.id = id
        this.description = description
        this.type = type
        this.active = active == 'Y'
    }
}
