const { expect } = require('chai')
const contextProperties = require('../contextProperties')

describe('Should read/write properties', () => {
  it('Should set / get tokens', () => {
    const context = {}
    contextProperties.setTokens(context, 'a', 'b')
    expect(contextProperties.getAccessToken(context)).to.be.equal('a')
    expect(contextProperties.getRefreshToken(context)).to.be.equal('b')
  })

  it('Should return null if tokens not present', () => {
    const context = {}
    // eslint-disable-next-line
    expect(contextProperties.getAccessToken(context)).to.be.null
    // eslint-disable-next-line
    expect(contextProperties.getRefreshToken(context)).to.be.null
  })

  it('Should know if the context has no tokens', () => {
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(null)).to.be.false
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(undefined)).to.be.false
    // eslint-disable-next-line
    expect(contextProperties.hasTokens({})).to.be.false
  })

  it('Should know if the context has tokens', () => {
    const context = {}
    contextProperties.setTokens(context, null, null)
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(context)).to.be.false

    contextProperties.setTokens(context, '', '')
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(context)).to.be.false

    contextProperties.setTokens(context, 'a', '')
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(context)).to.be.false

    contextProperties.setTokens(context, '', 'b')
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(context)).to.be.false

    contextProperties.setTokens(context, 'a', 'b')
    // eslint-disable-next-line
    expect(contextProperties.hasTokens(context)).to.be.true
  })

  it('Should set the request pagination properties', () => {
    const context = {}
    contextProperties.setRequestPagination(context, {
      'Page-offset': 1,
      'Page-Limit': 10,
      'SORT-FIELDS': 'a,b',
      'sort-order': 'ASC',
    })
    expect(contextProperties.getRequestPagination(context)).to.deep.equal({
      'page-offset': 1,
      'page-limit': 10,
      'sort-fields': 'a,b',
      'sort-order': 'ASC',
    })
  })

  it('Should return an empty requestPagination object even when the setter has not been called', () => {
    expect(contextProperties.getRequestPagination({})).to.deep.equal({})
  })

  it('Should set the response pagination properties', () => {
    const context = {}
    contextProperties.setResponsePagination(context, {
      'PAGE-offset': 1,
      'page-LIMIT': 10,
      'Sort-Fields': 'a,b',
      'sort-order': 'ASC',
      'total-records': 100,
    })
    expect(contextProperties.getResponsePagination(context)).to.deep.equal({
      'page-offset': 1,
      'page-limit': 10,
      'sort-fields': 'a,b',
      'sort-order': 'ASC',
      'total-records': 100,
    })
  })

  it('Should return an empty responsePagination object if no values were set', () => {
    const context = {}
    contextProperties.setResponsePagination(context, {})
    expect(contextProperties.getResponsePagination(context)).to.deep.equal({})
  })

  it('Should return an empty responsePagination object even when the setter has not been called', () => {
    expect(contextProperties.getResponsePagination({})).to.deep.equal({})
  })
})
