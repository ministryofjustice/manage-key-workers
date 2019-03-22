import { lookupMeta } from './govuk-helpers'

describe('the lookupMeta function', () => {
  it('should return no meta if no error as string', () => {
    expect(lookupMeta('name', '')).toEqual({})
  })
  it('should return no meta if no error as array', () => {
    expect(lookupMeta('name', [])).toEqual({})
  })
  it('should return meta if error present', () => {
    expect(lookupMeta('name', [{ targetName: 'name', text: 'some error' }])).toEqual({
      touched: true,
      error: 'some error',
    })
  })
})
