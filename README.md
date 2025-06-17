[![CircleCI](https://circleci.com/gh/ministryofjustice/manage-key-workers/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/manage-key-workers)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/manage-key-workers/badge.svg)](https://snyk.io/test/github/ministryofjustice/manage-key-workers)

# manage-key-workers

This service was previously referred to by names *OMiC UI* and *Keyworker UI*  (confusingly), but we've settled on Manage Key Workers.

The service requires the following minimum tool versions:

- node v10+ 
- Chrome 
- Chromedriver (align the version with chrome version installed on your machine)

(The Gradle wrapper is bundled with the project, currently at version 5.0)

Ensure that you have these installed using your system package manager and/or npm for node. 

# Dependent services when running locally

When running locally this service needs to use several other supporting services which
need to be running and available at known locations.

- Elite2API        port: 8080
- Keyworker API    port: 8081
- Oauth2 Server    port: 9090

For simplicity, the easiest way to make these services available is to clone the elite2api
repository and to run the docker compose file in the root directory to bring up local 
versions of all three. This starts the services at the above default ports on your
machine.

```
$ docker-compose pull && docker-compose up"  
```

# Running manage-key-workers locally

The application can be built & run with the following bash commands : 

```
npm install
npm start
```

This will start the service and use the default dependent services as above.

The UI will be available on http://localhost:3001

NPM will use the package.json file in the root of the project to download any required dependencies.
You will need to re-run these commands each time you make a change to ensure that the react application is updated.


# Overriding the Default Environment Settings

When manage-key-workers runs in non-local environments it requires a set of environment variables to 
tell it where to find the dependent services and other important settings.
The following environment variables supply these values:


| Environment Variable             |              Description               |
|----------------------------------|:--------------------------------------:|
| API_CLIENT_ID                    |   Client ID for accessing prison-api   |
| API_CLIENT_SECRET                | Client secret for accessing prison-api |
| API_ENDPOINT_URL                 |           URL to prison-api            |
| PRISONER_SEARCH_API_ENDPOINT_URL | URL to the prisoner elastic search api |
| OAUTH_ENDPOINT_URL               |        URL to the Oauth2 server        |
| HMPPS_MANAGE_USERS_API_URL       |      URL to the Manage Users API       |
| NN_ENDPOINT_URL                  |              New Nomis UI              |
| KEYWORKER_API_URL                |        URL to the Keyworker API        |
| PRISON_STAFF_HUB_UI_URL          |       URL to Prison Staff Hub UI       |
| SESSION_COOKIE_SECRET            |         Session cookie secret          | 


# Production execution

For a production build run the following within bash :

```
npm run build
node-env mode=PRODUCTION npm start
```

# Running in Docker locally

```
docker run -p 3000:3000 -d \
     --name manage-key-workers \
     -e USE_API_GATEWAY_AUTH=no \
     quay.io/hmpps/manage-key-workers:latest
```

# Running in a remote environment

```
docker run -p 3000:3000 -d \
     --name manage-key-workers \
     -e USE_API_GATEWAY_AUTH=yes \
     -e API_ENDPOINT_URL=https://prison-api-dev.prison.service.justice.gov.uk \
     -e PRISONER_SEARCH_API_ENDPOINT_URL=https://prisoner-search-dev.prison.service.justice.gov.uk \
     -e API_GATEWAY_TOKEN=<add here> \
     -e API_CLIENT_SECRET=<add here> \
     -e API_GATEWAY_PRIVATE_KEY=<add here> \
     quay.io/hmpps/manage-key-workers:latest
```

# Cypress integration tests
The `integration-tests` directory contains a set of Cypress integration tests.
These tests use WireMock to stub the application's dependencies on prison-api, oauth and whereabouts RESTful APIs.
### Running the Cypress tests
You need to fire up the wiremock and redis servers first:
```docker compose -f docker-compose-test.yaml up```
This will give you useful feedback if the app is making requests that you haven't mocked out. You can see
the request log at `localhost:9191/__admin/requests/` and a JSON representation of the mocks `localhost:9191/__admin/mappings`.
### Starting feature tests node instance
A separate node instance needs to be started for the feature tests. This will run on port 3008 and won't conflict
with any of the api services, e.g. elite2-api or oauth. It will also not conflict with the Groovy integration tests.
```npm run start-feature --env=cypress.env```
Note that the circleci will run `start-feature-no-webpack` instead, which will rely on a production webpack build
rather than using the dev webpack against the assets.
### Running the tests
With the UI:
```
npm run int-test-ui
```
Just on the command line (any console log outputs will not be visible, they appear in the browser the Cypress UI fires up):
```
npm run int-test
```


### Useful links

- WireMock: http://wiremock.org/

