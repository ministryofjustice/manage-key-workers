/* eslint-disable max-nested-callbacks */
const supertest = require('supertest');
const express = require('express');
const chai = require('chai');

const { expect } = chai;
chai.use(require('sinon-chai'));
const bodyParser = require('body-parser');

const contextProperties = require('../contextProperties');
const requestForwarding = require('../request-forwarding');


describe('Test request forwarding', () => {
  describe('extractRequestPaginationMiddleware', () => {
    let context;

    const app = express();
    app.use(requestForwarding.extractRequestPaginationMiddleware);
    app.use('/', (req, res) => {
      context = res.locals;
      res.end();
    });
    const request = supertest(app);

    it('Should copy request pagination header values to a context object', () =>
      request
        .get('/')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .set('junk', 'junkValue')
        .expect(200)
        .then(() => {
          expect(contextProperties.getRequestPagination(context)).to.deep.equal({
            'page-offset': '20',
            'page-limit': '10'
          });
        }),
    );
  });

  describe('pagination headers on response', () => {
    const responseHeaders = { 'total-records': '100', 'test-header': 'test-value' };

    const apiFunction = (context) => new Promise((resolve) => {
      contextProperties.setResponsePagination(context, responseHeaders);
      resolve();
    });

    const eliteApi = { get: apiFunction, post: apiFunction };

    const forwardingHandler = requestForwarding.forwardingHandlerFactory(eliteApi);

    const app = express();
    app.use(bodyParser.json());
    app.use(requestForwarding.extractRequestPaginationMiddleware);
    app.use('/app', forwardingHandler);
    const request = supertest(app);

    it('pagination headers should be set on response to get', () =>
      request
        .get('/app/me/locations')
        .expect(200)
        .expect('total-records', '100')
    );

    it('pagination headers should be set on response to post', () =>
      request
        .post('/app/me/locations')
        .expect(200)
        .expect('total-records', '100')
    );
  });
});
