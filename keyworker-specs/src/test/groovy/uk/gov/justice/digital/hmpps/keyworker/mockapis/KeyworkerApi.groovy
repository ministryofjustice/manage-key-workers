package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get

class KeyworkerApi extends WireMockRule {
    KeyworkerApi() {
        super(8081)
    }

    void stubGetAvailableKeyworkers(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/available")
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                .willReturn(aResponse()
                        .withStatus(400))
        )
    }

    void stubEmptyListResponse(url) {
        stubFor(
                get(url)
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('[]')
                ))
    }

    void stub500Error(url) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(500)))
    }

    void stubDelayed500Error(url) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(500)
                                .withFixedDelay(3000)))
    }

    void stubHealth(url) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''
{
    "status": "UP",
    "healthInfo": {
        "status": "UP",
        "version": "version not available"
    },
    "diskSpace": {
        "status": "UP",
        "total": 510923390976,
        "free": 143828922368,
        "threshold": 10485760
    },
    "db": {
        "status": "UP",
        "database": "HSQL Database Engine",
        "hello": 1
    }
}''')
                ))
    }
    /*

  SELECT SM.LAST_NAME,
         SM.FIRST_NAME,
         SM.STAFF_ID,
         (SELECT COUNT(1) FROM OFFENDER_KEY_WORKERS OKW
          WHERE OKW.ACTIVE_FLAG = 'Y'
            AND OKW.OFFICER_ID = SM.STAFF_ID
            AND OKW.AGY_LOC_ID IN (
              SELECT DISTINCT(SLR.CAL_AGY_LOC_ID)
              FROM STAFF_LOCATION_ROLES SLR
              WHERE SLR.SAC_STAFF_ID = SM.STAFF_ID
                AND SLR.POSITION = 'AO'
                AND SLR.ROLE = 'KW'
                AND TRUNC(SYSDATE) BETWEEN TRUNC(SLR.FROM_DATE) AND TRUNC(COALESCE(SLR.TO_DATE,SYSDATE)))) NUMBER_ALLOCATED
  FROM STAFF_LOCATION_ROLES SLR
    INNER JOIN STAFF_MEMBERS SM ON SM.STAFF_ID = SLR.SAC_STAFF_ID
      AND SM.STATUS = 'ACTIVE'
  WHERE SLR.CAL_AGY_LOC_ID = :agencyId
    AND SLR.POSITION = 'AO'
    AND SLR.ROLE = 'KW'
    AND TRUNC(SYSDATE) BETWEEN TRUNC(SLR.FROM_DATE) AND TRUNC(COALESCE(SLR.TO_DATE,SYSDATE))
    AND SLR.FROM_DATE = (SELECT MAX(SLR2.FROM_DATE)
                         FROM STAFF_LOCATION_ROLES SLR2
                         WHERE SLR2.SAC_STAFF_ID = SLR.SAC_STAFF_ID
                           AND SLR2.CAL_AGY_LOC_ID = SLR.CAL_AGY_LOC_ID
                           AND SLR2.POSITION = SLR.POSITION
                           AND SLR2.ROLE = SLR.ROLE)



CREATE TABLE STAFF_LOCATION_ROLES -- A Staff Member holding an Agency Location specific role & position.
(   CAL_AGY_LOC_ID                VARCHAR2(6 CHAR)                        NOT NULL,
    SAC_STAFF_ID                  NUMBER(10)                              NOT NULL,
    FROM_DATE                     DATE                                    NOT NULL,
    TO_DATE                       DATE,
    POSITION                      VARCHAR2(12 CHAR)                       NOT NULL,
    ROLE                          VARCHAR2(12 CHAR)                       NOT NULL,
    SCHEDULE_TYPE                 VARCHAR2(12 CHAR),
    HOURS_PER_WEEK                NUMBER(4,2),
    SUPERVISOR_AGY_LOC_ID         VARCHAR2(6 CHAR),
    SUPERVISOR_STAFF_ID           NUMBER(10),
    SUPERVISOR_FROM_DATE          DATE,
    SUPERVISOR_POSITION           VARCHAR2(12 CHAR),
    SUPERVISOR_ROLE               VARCHAR2(12 CHAR),
    STAFF_UNIT                    VARCHAR2(12 CHAR),
    CREATE_DATETIME               TIMESTAMP(9)       DEFAULT systimestamp NOT NULL,
    CREATE_USER_ID                VARCHAR2(32 CHAR)  DEFAULT USER         NOT NULL,
    MODIFY_DATETIME               TIMESTAMP(9),
    MODIFY_USER_ID                VARCHAR2(32 CHAR),
    AUDIT_TIMESTAMP               TIMESTAMP(9),
    AUDIT_USER_ID                 VARCHAR2(32 CHAR),
    AUDIT_MODULE_NAME             VARCHAR2(65 CHAR),
    AUDIT_CLIENT_USER_ID          VARCHAR2(64 CHAR),
    AUDIT_CLIENT_IP_ADDRESS       VARCHAR2(39 CHAR),
    AUDIT_CLIENT_WORKSTATION_NAME VARCHAR2(64 CHAR),
    AUDIT_ADDITIONAL_INFO         VARCHAR2(256 CHAR),
    CONSTRAINT CHK_DATES CHECK (from_date <= nvl(to_date,from_date)),
    CONSTRAINT STAFF_LOCATION_ROLES_PK PRIMARY KEY (SAC_STAFF_ID, CAL_AGY_LOC_ID, FROM_DATE, POSITION, ROLE)
);

INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -2, TO_DATE('2016-08-08','YYYY-MM-DD'), NULL,                               'AO',  'OS', 'FT', 9);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -2, TO_DATE('2016-08-08','YYYY-MM-DD'), TO_DATE('2017-12-08','YYYY-MM-DD'), 'AO',  'KW', 'FT', 9);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -2, SYSDATE + INTERVAL '2' DAY,         NULL,                               'AO',  'KW', 'FT', 9);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -5, TO_DATE('2016-08-08','YYYY-MM-DD'), TO_DATE('2017-12-08','YYYY-MM-DD'), 'AO',  'KW', 'FT', 10);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -5, TO_DATE('2018-01-02','YYYY-MM-DD'), NULL,                               'AO',  'KW', 'FT', 11);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -2, TO_DATE('2016-08-08','YYYY-MM-DD'), NULL,                               'PRO', 'OS', 'FT', 7);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('LEI', -1, TO_DATE('2016-08-08','YYYY-MM-DD'), NULL,                               'PRO', 'KW', 'FT', 6);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('WAI', -8, TO_DATE('2018-01-02','YYYY-MM-DD'), NULL,                               'AO',  'KW', 'FT', 11);
INSERT INTO STAFF_LOCATION_ROLES (CAL_AGY_LOC_ID, SAC_STAFF_ID, FROM_DATE, TO_DATE, POSITION, ROLE, SCHEDULE_TYPE, HOURS_PER_WEEK) VALUES ('SYI', -9, TO_DATE('2018-01-02','YYYY-MM-DD'), NULL,                               'AO',  'KW', 'FT', 11);

     */



//    ........GET /key-worker/LEI/available HTTP/1.1
//    Accept: application/json, text/plain, */*
//authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//access-control-allow-origin: localhost:3001
//User-Agent: axios/0.17.1
//Host: localhost:8081
//Connection: close
//

    //........HTTP/1.1 200 OK
//Connection: close
//Date: Sun, 25 Mar 2018 01:34:37 GMT
//X-Content-Type-Options: nosniff
//X-XSS-Protection: 1; mode=block
//Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//Pragma: no-cache
//Expires: 0
//X-Frame-Options: DENY
//X-Application-Context: application:dev:8081
//Content-Type: application/json;charset=utf-8
//
//[{"staffId":-5,"firstName":"Another","lastName":"User","numberAllocated":3}]

    void stubGetOffenders(String agencyId, List<String> offenderNumbers) {

    }

//    ........GET /key-worker/LEI/offenders?offenderNo=Z0025ZZ& HTTP/1.1
//    Accept: application/json, text/plain, */*
//authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//access-control-allow-origin: localhost:3001
//User-Agent: axios/0.17.1
//Host: localhost:8081
//Connection: close
//

//........HTTP/1.1 200 OK
//Connection: close
//Date: Sun, 25 Mar 2018 01:34:38 GMT
//X-Content-Type-Options: nosniff
//X-XSS-Protection: 1; mode=block
//Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//Pragma: no-cache
//Expires: 0
//X-Frame-Options: DENY
//X-Application-Context: application:dev:8081
//Content-Type: application/json;charset=utf-8
//
//[]

}
