package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AllocatedResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AllocationsForKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AvailableKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerDetailResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.UnallocatedResponse
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo

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

    void stubError(url, status) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(status)))
    }

    void stubDelayedError(url, status) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(status)
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

    void stubKeyworkerSearchResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/members?nameFilter=")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                          .withBody(KeyworkerSearchResponse.response)
                          .withStatus(200))
        )
    }

    void stubKeyworkerDetailResponse(AgencyLocation agencyLocation, int staffId = KeyworkerResultsPage.test_keyworker_staffId) {
        stubFor(
                get("/key-worker/${staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(KeyworkerDetailResponse.getResponse(staffId))
                        .withStatus(200))
        )
    }

    void stubInactiveKeyworkerDetailResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(KeyworkerDetailResponse.response_keyworker_inactive)
                        .withStatus(200))
        )
    }

    void stubAllocationsForKeyworkerResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}/offenders")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(AllocationsForKeyworkerResponse.response)
                        .withStatus(200))
        )
    }

    void stubAvailableKeyworkersResponse(AgencyLocation agencyLocation, boolean insufficient) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/available")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(insufficient ?
                        AvailableKeyworkerResponse.insufficientResponse :
                        AvailableKeyworkerResponse.response)
                        .withStatus(200))
        )
    }

    void stubKeyworkerUpdate(AgencyLocation agencyLocation) {
        stubFor(
                post("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubUnallocatedResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/offenders/unallocated")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(UnallocatedResponse.response)
                        .withStatus(200))
        )
    }

    void stubStartAllocateResponse(AgencyLocation agencyLocation) {
        stubFor(
                post("/key-worker/${agencyLocation.id}/allocate/start")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubStartAllocateFailureResponse(AgencyLocation agencyLocation) {
        stubFor(
                post("/key-worker/${agencyLocation.id}/allocate/start")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withStatusMessage("Request failed with status code 400")
                        .withBody('''{"status":400,"userMessage":"No Key workers available for allocation."}''')
                        .withStatus(400))
        )
    }

    void stubAutoAllocationsResponse(AgencyLocation agencyLocation) {
        stubFor(
                get(urlPathEqualTo("/key-worker/${agencyLocation.id}/allocations"))//?allocationType=P&fromDate=.*&toDate=.*"))  urlMatching(...)
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
             //   .withQueryParam()
                        .willReturn(aResponse()
                        .withBody(AllocatedResponse.response)
                        .withStatus(200))
        )
    }

    void stubAutoAllocationsConfirmResponse(AgencyLocation agencyLocation) {
        stubFor(
                post("/key-worker/${agencyLocation.id}/allocate/confirm")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubManualOverrideResponse(AgencyLocation agencyLocation, offenderNo, staffId) {
        stubFor(
                post("/key-worker/${agencyLocation.id}/allocate")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                .withRequestBody('{"offenderNo":${offenderNo},"staffId":"${staffId}","prisonId":"LEI","allocationType":"M","allocationReason":"MANUAL","deallocationReason":"OVERRIDE"}'

//{"offenderNo":"A9876EC","staffId":"-1","prisonId":"LEI","allocationType":"M","allocationReason":"MANUAL","deallocationReason":"OVERRIDE"}
//{"offenderNo":"Z0024ZZ","staffId":"-5","prisonId":"LEI","allocationType":"M","allocationReason":"MANUAL","deallocationReason":"OVERRIDE"}
)
                        .willReturn(aResponse()
                        .withStatus(201))
        )
    }


//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/LEI/allocate/start","msg":"Calling API","time":"2018-04-16T13:56:41.396Z","v":0}
//
//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/LEI/available","msg":"Calling API","time":"2018-04-16T13:56:41.701Z","v":0}
//    {"name":"keyworkerUI","level":20,"availableKeyworkers":[{"staffId":-3,"firstName":"HPA","lastName":"User","capacity":6,"numberAllocated":0,"agencyId":"LEI","status":"ACTIVE","autoAllocationAllowed":true},{"staffId":-1,"firstName":"Elite2","lastName":"User","capacity":6,"numberAllocated":0,"agencyId":"LEI","status":"ACTIVE","autoAllocationAllowed":true},{"staffId":-5,"firstName":"Another","lastName":"User","capacity":6,"numberAllocated":3,"agencyId":"LEI","status":"ACTIVE","autoAllocationAllowed":true},{"staffId":-2,"firstName":"API","lastName":"User","capacity":6,"numberAllocated":10,"agencyId":"LEI","status":"ACTIVE","autoAllocationAllowed":true}],"msg":"Response from available keyworker request","time":"2018-04-16T13:56:41.752Z","v":0}
//
//    Gateway: config url :http://localhost:8080/key-worker/LEI/allocations?allocationType=P&fromDate=2018-04-16&toDate=2018-04-16
//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/LEI/allocations?allocationType=P&fromDate=2018-04-16&toDate=2018-04-16","msg":"Calling API","time":"2018-04-16T13:56:41.758Z","v":0}
//    Gateway: config url :http://localhost:8080/key-worker/LEI/allocations?allocationType=P&fromDate=2018-04-16&toDate=2018-04-16
//    {"name":"keyworkerUI","level":20,"availableKeyworkers":[{"offenderNo":"A6676RS","firstName":"NEIL","lastName":"BRADLEY","staffId":-5,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.629","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"A9876EC","firstName":"ERIC","lastName":"CLAPTON","staffId":-3,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.641","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"Z0024ZZ","firstName":"LUCIUS","lastName":"FOX","staffId":-1,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.647","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"Z0017ZZ","firstName":"MICHEAL","lastName":"JACKSON","staffId":-3,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.667","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"A5577RS","firstName":"HAROLD","lastName":"LLOYD","staffId":-1,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.674","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"A1178RS","firstName":"FRED","lastName":"QUIMBY","staffId":-3,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.679","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"A4476RS","firstName":"NEIL","lastName":"SARLY","staffId":-1,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.684","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"Z0025ZZ","firstName":"MATTHEW","lastName":"SMITH","staffId":-3,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.69","allocationType":"P","internalLocationDesc":"H-1"},{"offenderNo":"Z0018ZZ","firstName":"NICK","lastName":"TALBOT","staffId":-1,"agencyId":"LEI","prisonId":"LEI","assigned":"2018-04-16T14:56:41.694","allocationType":"P","internalLocationDesc":"H-1"}],"msg":"Response from allocated offenders request","time":"2018-04-16T13:56:41.849Z","v":0}
//
//
//
//    Gateway: config url :http://localhost:8080/key-worker/LEI/allocate/confirm
//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/LEI/allocate/confirm","msg":"Calling API","time":"2018-04-16T13:56:53.156Z","v":0}
//    Gateway: config url :http://localhost:8080/key-worker/allocate
//    {"name":"keyworkerUI","level":20,"status":200,"msg":"Response from autoAllocateConfirm request","time":"2018-04-16T13:56:53.173Z","v":0}
//
//    {"name":"keyworkerUI","level":20,"allocateList":[null,{"staffId":"-1","offenderNo":"A9876EC"},{"staffId":"-5","offenderNo":"Z0024ZZ"}],"msg":"Manual override contents","time":"2018-04-16T13:56:53.173Z","v":0}
//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/allocate","data":{"offenderNo":"A9876EC","staffId":"-1","prisonId":"LEI","allocationType":"M","allocationReason":"MANUAL","deallocationReason":"OVERRIDE"},"msg":"Calling API","time":"2018-04-16T13:56:53.174Z","v":0}
//    {"name":"keyworkerUI","level":20,"response":{"status":201,"statusText":"Created","headers":{"connection":"close","date":"Mon, 16 Apr 2018 13:56:53 GMT","x-content-type-options":"nosniff","x-xss-protection":"1; mode=block","cache-control":"no-cache, no-store, max-age=0, must-revalidate","pragma":"no-cache","expires":"0","x-frame-options":"DENY","x-application-context":"application:dev:8080"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..mepe7UoXOkbhsic9xrGGpUktWhMFVkMwAWzr5VJ1wYvej-VCLEJC1WtutVphfUGBXZ6p0vxZd8NQ61K3ar5XZEEvFyJzHAFU0I-Af6ZK8RZEg_qeaxmBJlEFnX3vFtN709RLhOSSumt_HI-Y117199ERdLWjy3A8wg6K9gXRtkERZBDl-wdi3vGwk6uyzIqRwOMPF9a24d9D2Y-rFsCGkwVP97JG5k0pyqZ36BJYNJvn_Fo1HY1VoJ5WmWXgzsg-KFz-NlxsxHdGwR9bdkQiFje6rog_MZfd2ekiLBstog5xr-JDEQYE89hC_cd7wCGxbsmKzyFmbDj8KjyZLgNJWw","access-control-allow-origin":"localhost:3001","User-Agent":"axios/0.17.1","Content-Length":137},"method":"post","url":"http://localhost:8080/key-worker/allocate","data":"{\"offenderNo\":\"A9876EC\",\"staffId\":\"-1\",\"prisonId\":\"LEI\",\"allocationType\":\"M\",\"allocationReason\":\"MANUAL\",\"deallocationReason\":\"OVERRIDE\"}"},"request":{"domain":null,"_events":{},"_eventsCount":6,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":false,"_last":true,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":false,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"","finished":true,"_headerSent":true,"socket":{"connecting":false,"_hadError":false,"_handle":null,"_parent":null,"_host":"localhost","_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"destroyed":true,"defaultEncoding":"utf8","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{"close":[null,null]},"_eventsCount":9,"_writableState":{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":true,"ended":true,"finished":true,"destroyed":true,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":false,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":true,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":{"next":null,"entry":null},"entry":null}},"writable":false,"allowHalfOpen":false,"_bytesDispatched":1055,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":null,"_server":null,"parser":null,"_httpMessage":"[Circular]","_consuming":true,"_idleNext":null,"_idlePrev":null,"_idleTimeout":-1},"connection":"[Circular]","_header":"POST /key-worker/allocate HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/json\r\nauthorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjM5MTU3MjUsImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiZTMzYzJiMTYtZDllZi00ZWViLThmMDMtNDQ4ZjM1NWY4NmQ3IiwiY2xpZW50X2lkIjoib21pYyJ9.mepe7UoXOkbhsic9xrGGpUktWhMFVkMwAWzr5VJ1wYvej-VCLEJC1WtutVphfUGBXZ6p0vxZd8NQ61K3ar5XZEEvFyJzHAFU0I-Af6ZK8RZEg_qeaxmBJlEFnX3vFtN709RLhOSSumt_HI-Y117199ERdLWjy3A8wg6K9gXRtkERZBDl-wdi3vGwk6uyzIqRwOMPF9a24d9D2Y-rFsCGkwVP97JG5k0pyqZ36BJYNJvn_Fo1HY1VoJ5WmWXgzsg-KFz-NlxsxHdGwR9bdkQiFje6rog_MZfd2ekiLBstog5xr-JDEQYE89hC_cd7wCGxbsmKzyFmbDj8KjyZLgNJWw\r\naccess-control-allow-origin: localhost:3001\r\nUser-Agent: axios/0.17.1\r\nContent-Length: 137\r\nHost: localhost:8080\r\nConnection: close\r\n\r\n","agent":{"domain":null,"_events":{},"_eventsCount":1,"defaultPort":80,"protocol":"http:","options":{"path":null},"requests":{},"sockets":{"localhost:8080:":["[Circular]"]},"freeSockets":{},"keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},"method":"POST","path":"/key-worker/allocate","_ended":true,"res":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"destroyed":false,"defaultEncoding":"utf8","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{"end":[null,null]},"_eventsCount":3,"socket":"[Circular]","connection":"[Circular]","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":"[Circular]","rawHeaders":["Connection","close","Date","Mon, 16 Apr 2018 13:56:53 GMT","X-Content-Type-Options","nosniff","X-XSS-Protection","1; mode=block","Cache-Control","no-cache, no-store, max-age=0, must-revalidate","Pragma","no-cache","Expires","0","X-Frame-Options","DENY","X-Application-Context","application:dev:8080"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"","method":null,"statusCode":201,"statusMessage":"Created","client":"[Circular]","_consuming":true,"_dumped":false,"req":"[Circular]","responseUrl":"http://localhost:8080/key-worker/allocate"},"timeoutCb":null,"upgradeOrConnect":false,"parser":null,"maxHeadersCount":null,"_redirectable":{"_writableState":{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"domain":null,"_events":{},"_eventsCount":2,"_options":{"protocol":"http:","maxRedirects":21,"maxBodyLength":10485760,"hostname":"localhost","port":"8080","path":"/key-worker/allocate","method":"post","headers":"[Circular]","nativeProtocols":{"http:":{"METHODS":["ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE"],"STATUS_CODES":{"100":"Continue","101":"Switching Protocols","102":"Processing","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","208":"Already Reported","226":"IM Used","300":"Multiple Choices","301":"Moved Permanently","302":"Found","303":"See Other","304":"Not Modified","305":"Use Proxy","307":"Temporary Redirect","308":"Permanent Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Payload Too Large","414":"URI Too Long","415":"Unsupported Media Type","416":"Range Not Satisfiable","417":"Expectation Failed","418":"I'm a teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Unordered Collection","426":"Upgrade Required","428":"Precondition Required","429":"Too Many Requests","431":"Request Header Fields Too Large","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","508":"Loop Detected","509":"Bandwidth Limit Exceeded","510":"Not Extended","511":"Network Authentication Required"},"globalAgent":"[Circular]"},"https:":{"globalAgent":{"domain":null,"_events":{},"_eventsCount":1,"defaultPort":443,"protocol":"https:","options":{"path":null},"requests":{},"sockets":{},"freeSockets":{},"keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":{"map":{},"list":[]}}}},"pathname":"/key-worker/allocate"},"_redirectCount":0,"_requestBodyLength":137,"_requestBodyBuffers":[],"_currentRequest":"[Circular]","_currentUrl":"http://localhost:8080/key-worker/allocate"}},"data":""},"msg":"Response from allocate request","time":"2018-04-16T13:56:53.349Z","v":0}
//    {"name":"keyworkerUI","level":20,"url":"http://localhost:8080/key-worker/allocate","data":{"offenderNo":"Z0024ZZ","staffId":"-5","prisonId":"LEI","allocationType":"M","allocationReason":"MANUAL","deallocationReason":"OVERRIDE"},"msg":"Calling API","time":"2018-04-16T13:56:53.353Z","v":0}
//    {"name":"keyworkerUI","level":20,"response":{"status":201,"statusText":"Created","headers":{"connection":"close","date":"Mon, 16 Apr 2018 13:56:53 GMT","x-content-type-options":"nosniff","x-xss-protection":"1; mode=block","cache-control":"no-cache, no-store, max-age=0, must-revalidate","pragma":"no-cache","expires":"0","x-frame-options":"DENY","x-application-context":"application:dev:8080"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..mepe7UoXOkbhsic9xrGGpUktWhMFVkMwAWzr5VJ1wYvej-VCLEJC1WtutVphfUGBXZ6p0vxZd8NQ61K3ar5XZEEvFyJzHAFU0I-Af6ZK8RZEg_qeaxmBJlEFnX3vFtN709RLhOSSumt_HI-Y117199ERdLWjy3A8wg6K9gXRtkERZBDl-wdi3vGwk6uyzIqRwOMPF9a24d9D2Y-rFsCGkwVP97JG5k0pyqZ36BJYNJvn_Fo1HY1VoJ5WmWXgzsg-KFz-NlxsxHdGwR9bdkQiFje6rog_MZfd2ekiLBstog5xr-JDEQYE89hC_cd7wCGxbsmKzyFmbDj8KjyZLgNJWw","access-control-allow-origin":"localhost:3001","User-Agent":"axios/0.17.1","Content-Length":137},"method":"post","url":"http://localhost:8080/key-worker/allocate","data":"{\"offenderNo\":\"Z0024ZZ\",\"staffId\":\"-5\",\"prisonId\":\"LEI\",\"allocationType\":\"M\",\"allocationReason\":\"MANUAL\",\"deallocationReason\":\"OVERRIDE\"}"},"request":{"domain":null,"_events":{},"_eventsCount":6,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":false,"_last":true,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":false,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"","finished":true,"_headerSent":true,"socket":{"connecting":false,"_hadError":false,"_handle":null,"_parent":null,"_host":"localhost","_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"destroyed":true,"defaultEncoding":"utf8","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{"close":[null,null]},"_eventsCount":9,"_writableState":{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":true,"ended":true,"finished":true,"destroyed":true,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":false,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":true,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":{"next":null,"entry":null},"entry":null}},"writable":false,"allowHalfOpen":false,"_bytesDispatched":1055,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":null,"_server":null,"parser":null,"_httpMessage":"[Circular]","_consuming":true,"_idleNext":null,"_idlePrev":null,"_idleTimeout":-1},"connection":"[Circular]","_header":"POST /key-worker/allocate HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/json\r\nauthorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjM5MTU3MjUsImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiZTMzYzJiMTYtZDllZi00ZWViLThmMDMtNDQ4ZjM1NWY4NmQ3IiwiY2xpZW50X2lkIjoib21pYyJ9.mepe7UoXOkbhsic9xrGGpUktWhMFVkMwAWzr5VJ1wYvej-VCLEJC1WtutVphfUGBXZ6p0vxZd8NQ61K3ar5XZEEvFyJzHAFU0I-Af6ZK8RZEg_qeaxmBJlEFnX3vFtN709RLhOSSumt_HI-Y117199ERdLWjy3A8wg6K9gXRtkERZBDl-wdi3vGwk6uyzIqRwOMPF9a24d9D2Y-rFsCGkwVP97JG5k0pyqZ36BJYNJvn_Fo1HY1VoJ5WmWXgzsg-KFz-NlxsxHdGwR9bdkQiFje6rog_MZfd2ekiLBstog5xr-JDEQYE89hC_cd7wCGxbsmKzyFmbDj8KjyZLgNJWw\r\naccess-control-allow-origin: localhost:3001\r\nUser-Agent: axios/0.17.1\r\nContent-Length: 137\r\nHost: localhost:8080\r\nConnection: close\r\n\r\n","agent":{"domain":null,"_events":{},"_eventsCount":1,"defaultPort":80,"protocol":"http:","options":{"path":null},"requests":{},"sockets":{"localhost:8080:":["[Circular]"]},"freeSockets":{},"keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},"method":"POST","path":"/key-worker/allocate","_ended":true,"res":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"destroyed":false,"defaultEncoding":"utf8","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{"end":[null,null]},"_eventsCount":3,"socket":"[Circular]","connection":"[Circular]","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":"[Circular]","rawHeaders":["Connection","close","Date","Mon, 16 Apr 2018 13:56:53 GMT","X-Content-Type-Options","nosniff","X-XSS-Protection","1; mode=block","Cache-Control","no-cache, no-store, max-age=0, must-revalidate","Pragma","no-cache","Expires","0","X-Frame-Options","DENY","X-Application-Context","application:dev:8080"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"","method":null,"statusCode":201,"statusMessage":"Created","client":"[Circular]","_consuming":true,"_dumped":false,"req":"[Circular]","responseUrl":"http://localhost:8080/key-worker/allocate"},"timeoutCb":null,"upgradeOrConnect":false,"parser":null,"maxHeadersCount":null,"_redirectable":{"_writableState":{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"domain":null,"_events":{},"_eventsCount":2,"_options":{"protocol":"http:","maxRedirects":21,"maxBodyLength":10485760,"hostname":"localhost","port":"8080","path":"/key-worker/allocate","method":"post","headers":"[Circular]","nativeProtocols":{"http:":{"METHODS":["ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE"],"STATUS_CODES":{"100":"Continue","101":"Switching Protocols","102":"Processing","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","208":"Already Reported","226":"IM Used","300":"Multiple Choices","301":"Moved Permanently","302":"Found","303":"See Other","304":"Not Modified","305":"Use Proxy","307":"Temporary Redirect","308":"Permanent Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Payload Too Large","414":"URI Too Long","415":"Unsupported Media Type","416":"Range Not Satisfiable","417":"Expectation Failed","418":"I'm a teapot","421":"Misdirected Request","422":"Unprocessable Entity","423":"Locked","424":"Failed Dependency","425":"Unordered Collection","426":"Upgrade Required","428":"Precondition Required","429":"Too Many Requests","431":"Request Header Fields Too Large","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","508":"Loop Detected","509":"Bandwidth Limit Exceeded","510":"Not Extended","511":"Network Authentication Required"},"globalAgent":"[Circular]"},"https:":{"globalAgent":{"domain":null,"_events":{},"_eventsCount":1,"defaultPort":443,"protocol":"https:","options":{"path":null},"requests":{},"sockets":{},"freeSockets":{},"keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":{"map":{},"list":[]}}}},"pathname":"/key-worker/allocate"},"_redirectCount":0,"_requestBodyLength":137,"_requestBodyBuffers":[],"_currentRequest":"[Circular]","_currentUrl":"http://localhost:8080/key-worker/allocate"}},"data":""},"msg":"Response from allocate request","time":"2018-04-16T13:56:53.460Z","v":0}


//    {"name":"keyworkerUI","hostname":"DESKTOP-LSHC5NI","pid":11240,"level":50,"url":"http://localhost:8080/key-worker/BXI/allocate/start","status":400,"statusText":"Bad Request","headers":{"connection":"close","date":"Mon, 16 Apr 2018 14:45:21 GMT","x-content-type-options":"nosniff","x-xss-protection":"1; mode=block","cache-control":"no-cache, no-store, max-age=0, must-revalidate","pragma":"no-cache","expires":"0","x-frame-options":"DENY","x-application-context":"application:dev:8080","content-type":"application/json;charset=utf-8"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjM5MTg2NzMsImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMTZmZWY4MDEtOTViOS00ZTViLWEyYTgtMmQzNGJiYmIzMjE4IiwiY2xpZW50X2lkIjoib21pYyJ9.VywT7I81iWrS3G9a_2sarQ0MTwCiP6QMt0kEYYAGc9vcJvtp8tLjaqytU-HteqEFF8oy15BufcN7gU9MJwjfTOD049T7tTM7omeDJ0diodXzueDoVwXRMehJZ2bN_e_u_52wWUbYkMoBfwHVWJZLSEXdpb4UTBZG6JVD9OuZc4c-BUzYndHZnYVshOoJ2PfQSjQKU7zlyJFi_sYSKK3rxuAoOQDWpQ_7ddXHmcRmAgKdUQo5KqZCYFTtV7PnP2BfWRvDXloU098ywRm4Z4Cw-Gv2072PtzTIF99KMc_OnkMkki9GG-lpDsr9fC0qmSkUAmoqvZp0U5yXI3rENLhWvg","access-control-allow-origin":"localhost:3001","User-Agent":"axios/0.17.1"},"method":"post","url":"http://localhost:8080/key-worker/BXI/allocate/start"},"stack":"Error: Request failed with status code 400\n    at createError (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\core\\createError.js:16:15)\n    at settle (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\core\\settle.js:18:12)\n    at IncomingMessage.handleStreamEnd (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\adapters\\http.js:192:11)\n    at emitNone (events.js:110:20)\n    at IncomingMessage.emit (events.js:207:7)\n    at endReadableNT (_stream_readable.js:1059:12)\n    at _combinedTickCallback (internal/process/next_tick.js:138:11)\n    at process._tickCallback (internal/process/next_tick.js:180:9)","data":{"status":400,"userMessage":"No Key workers available for allocation."},"message":"Request failed with status code 400","msg":"Unexpected error caught in callApi","time":"2018-04-16T14:45:21.439Z","v":0}
//    {"name":"keyworkerUI","hostname":"DESKTOP-LSHC5NI","pid":11240,"level":50,"url":"/api/allocated?agencyId=BXI&allocationType=A&fromDate=16%2F04%2F2018&toDate=16%2F04%2F2018","status":400,"statusText":"Bad Request","headers":{"connection":"close","date":"Mon, 16 Apr 2018 14:45:21 GMT","x-content-type-options":"nosniff","x-xss-protection":"1; mode=block","cache-control":"no-cache, no-store, max-age=0, must-revalidate","pragma":"no-cache","expires":"0","x-frame-options":"DENY","x-application-context":"application:dev:8080","content-type":"application/json;charset=utf-8"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/json","authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjM5MTg2NzMsImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMTZmZWY4MDEtOTViOS00ZTViLWEyYTgtMmQzNGJiYmIzMjE4IiwiY2xpZW50X2lkIjoib21pYyJ9.VywT7I81iWrS3G9a_2sarQ0MTwCiP6QMt0kEYYAGc9vcJvtp8tLjaqytU-HteqEFF8oy15BufcN7gU9MJwjfTOD049T7tTM7omeDJ0diodXzueDoVwXRMehJZ2bN_e_u_52wWUbYkMoBfwHVWJZLSEXdpb4UTBZG6JVD9OuZc4c-BUzYndHZnYVshOoJ2PfQSjQKU7zlyJFi_sYSKK3rxuAoOQDWpQ_7ddXHmcRmAgKdUQo5KqZCYFTtV7PnP2BfWRvDXloU098ywRm4Z4Cw-Gv2072PtzTIF99KMc_OnkMkki9GG-lpDsr9fC0qmSkUAmoqvZp0U5yXI3rENLhWvg","access-control-allow-origin":"localhost:3001","User-Agent":"axios/0.17.1"},"method":"post","url":"http://localhost:8080/key-worker/BXI/allocate/start"},"stack":"Error: Request failed with status code 400\n    at createError (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\core\\createError.js:16:15)\n    at settle (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\core\\settle.js:18:12)\n    at IncomingMessage.handleStreamEnd (C:\\Users\\steve\\git\\keyworker-ui\\node_modules\\axios\\lib\\adapters\\http.js:192:11)\n    at emitNone (events.js:110:20)\n    at IncomingMessage.emit (events.js:207:7)\n    at endReadableNT (_stream_readable.js:1059:12)\n    at _combinedTickCallback (internal/process/next_tick.js:138:11)\n    at process._tickCallback (internal/process/next_tick.js:180:9)","data":{"status":400,"userMessage":"No Key workers available for allocation."},"message":"Request failed with status code 400","msg":"Error caught in asyncMiddleware","time":"2018-04-16T14:45:21.440Z","v":0}
//    {"name":"keyworkerUI","hostname":"DESKTOP-LSHC5NI","pid":11240,"req_id":"c9e90420-4184-11e8-8bef-2d5f59f018cb","level":30,"res":{"statusCode":400,"header":"HTTP/1.1 400 Bad Request\r\nX-DNS-Prefetch-Control: off\r\nX-Frame-Options: SAMEORIGIN\r\nStrict-Transport-Security: max-age=5184000; includeSubDomains; preload\r\nX-Download-Options: noopen\r\nX-Content-Type-Options: nosniff\r\nX-XSS-Protection: 1; mode=block\r\nX-Request-Id: c9e90420-4184-11e8-8bef-2d5f59f018cb\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: 42\r\nETag: W/\"2a-gS9RKoeDMsozlMQGOwDVGbAoGf0\"\r\nDate: Mon, 16 Apr 2018 14:45:21 GMT\r\nConnection: keep-alive\r\n\r\n"},"duration":97.86945999999999,"req":{"method":"GET","url":"/api/allocated?agencyId=BXI&allocationType=A&fromDate=16%2F04%2F2018&toDate=16%2F04%2F2018","headers":{"host":"localhost:3001","connection":"keep-alive","accept":"application/json, text/plain, */*","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36","referer":"http://localhost:3001/unallocated","accept-encoding":"gzip, deflate, br","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cookie":"hmpps-session-dev=eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGJuUmxjbTVoYkZWelpYSWlPblJ5ZFdVc0luVnpaWEpmYm1GdFpTSTZJa2xVUVVkZlZWTkZVaUlzSW5OamIzQmxJanBiSW5KbFlXUWlMQ0ozY21sMFpTSmRMQ0psZUhBaU9qRTFNak01TVRnMk56TXNJbUYxZEdodmNtbDBhV1Z6SWpwYklsSlBURVZmVEVsRFJVNURSVjlEUVNJc0lsSlBURVZmUzFkZlFVUk5TVTRpWFN3aWFuUnBJam9pTVRabVpXWTRNREV0T1RWaU9TMDBaVFZpTFdFeVlUZ3RNbVF6TkdKaVltSXpNakU0SWl3aVkyeHBaVzUwWDJsa0lqb2liMjFwWXlKOS5WeXdUN0k4MWlXclMzRzlhXzJzYXJRME1Ud0NpUDZRTXQwa0VZWUFHYzl2Y0p2dHA4dExqYXF5dFUtSHRlcUVGRjhveTE1QnVmY043Z1U5TUp3amZUT0QwNDlUN3RUTTdvbWVESjBkaW9kWHp1ZURvVndYUk1laEpaMmJOX2VfdV81MndXVWJZa01vQmZ3SFZXSlpMU0VYZHBiNFVUQlpHNkpWRDlPdVpjNGMtQlV6WW5kSFpuWVZzaE9vSjJQZlFTalFLVTd6bHlKRmlfc1lTS0szcnh1QW9PUURXcFFfN2RkWEhtY1JtQWdLZFVRbzVLcVpDWUZUdFY3UG5QMkJmV1J2RFhsb1UwOTh5d1JtNFo0Q3ctR3YyMDcyUHR6VElGOTlLTWNfT25rTWtraTlHRy1scERzcjlmQzBxbVNrVUFtb3F2WnAwVTV5WEkzckVOTGhXdmciLCJyZWZyZXNoX3Rva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBiblJsY201aGJGVnpaWElpT25SeWRXVXNJblZ6WlhKZmJtRnRaU0k2SWtsVVFVZGZWVk5GVWlJc0luTmpiM0JsSWpwYkluSmxZV1FpTENKM2NtbDBaU0pkTENKaGRHa2lPaUl4Tm1abFpqZ3dNUzA1TldJNUxUUmxOV0l0WVRKaE9DMHlaRE0wWW1KaVlqTXlNVGdpTENKbGVIQWlPakUxTWpNNU16TXdOek1zSW1GMWRHaHZjbWwwYVdWeklqcGJJbEpQVEVWZlRFbERSVTVEUlY5RFFTSXNJbEpQVEVWZlMxZGZRVVJOU1U0aVhTd2lhblJwSWpvaU5EZzJOR0V6TUdVdFpqVXdaQzAwTUdZM0xUa3lNamN0T1RWa1ptVXlaREJoTUdFeklpd2lZMnhwWlc1MFgybGtJam9pYjIxcFl5SjkuaEExVlgzNllmeGhqVUJMVEZlOGdFM3RqYTdYRENBVnRLZjBjZjFIRVlkZTUwZG1aOEZkUmsxZEkwdUdCb0ZLR2YwVldXbWt2UmxmcWo4VlFzeFFScENTTWFuNXJEZWFSLW56YWZZNXhaZ2RyRGQ4a2c1dmE4SEVJMHY5VmxscnZmWFF6RjVBM3pEeXAtQkhPeHljRHhIVkh0MW1rNnQ3aDhNLTJOd2VwSzdpVU9ycmZQcTVReUt3Z3JjWGMzbEpvMHNQcXhBZkxITmdPUVcwLWc3R2R1S09Jb2pOUTktdXdHR1NhZ3JydXZkZ3kzVHdnSjhLajVVYi1adm11V2o4ZjVqV09ZUWVwLTNkUUQtZ0JZaVMycENwek1WU1hVbTVkMklDLU1SdDFpMnFtbTRVMEpTMUlkdzhDNVZXQXo3UEhGOTR5enRXd0dHaEVVaklEUTVkblhBIiwibm93SW5NaW51dGVzIjoyNTM5ODE2NX0=; omic-session=eyJub3dJbk1pbnV0ZXMiOjI1Mzk4MTY1LCJpc0F1dGhlbnRpY2F0ZWQiOnRydWV9; omic-session.sig=lrjAG0tk9GiFBibR5N1TbpP7F-Q"},"query":{"agencyId":"BXI","allocationType":"A","fromDate":"16/04/2018","toDate":"16/04/2018"},"remoteAddress":"::1","remotePort":52527},"msg":"request finish","time":"2018-04-16T14:45:21.476Z","v":0}

}
