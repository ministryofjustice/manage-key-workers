import moment from 'moment'
import { renderDate, switchToIsoDateFormat, createQueryParamString, createValueString } from './stringUtils'

describe('the renderDate function', () => {
  const notPresentString = '--'

  it('should render a value that is not a moment as "--"', () => {
    expect(renderDate()).toBe(notPresentString)
  })

  it('should render a moment as DD/MM/YYYY', () => {
    expect(renderDate(moment({ year: 2018, month: 11, day: 30 }))).toBe('30/12/2018')
  })

  it('should render an ISO 8601 date formatted string (YYYY-MM-DD) as DD/MM/YYYY', () => {
    expect(renderDate('2018-12-30')).toBe('30/12/2018')
  })

  it('should render leading zeros', () => {
    expect(renderDate(moment({ year: 2018, M: 0, day: 1 }))).toBe('01/01/2018')
  })

  it('should render an illegal ISO 8601 formatted string as "--"', () => {
    expect(renderDate('2018-02-29')).toBe(notPresentString)
  })

  it('should render unparsable string as "--"', () => {
    expect(renderDate('abcd')).toBe(notPresentString)
  })

  it('should render null as "--"', () => {
    expect(renderDate(null)).toBe(notPresentString)
  })

  it('should render an object as "--"', () => {
    expect(renderDate({})).toBe(notPresentString)
  })

  it('should render an empty string as "--"', () => {
    expect(renderDate('')).toBe(notPresentString)
  })

  it('should render an integer as "--"', () => {
    expect(renderDate(0)).toBe(notPresentString)
  })

  it('should render a boolean as "--"', () => {
    expect(renderDate(false)).toBe(notPresentString)
  })

  it('should switch date format', () => {
    expect(switchToIsoDateFormat('25/11/1971')).toBe('1971-11-25')
  })

  it('should allow undefined when switching date format', () => {
    expect(switchToIsoDateFormat(undefined)).toBeUndefined()
  })

  it('should allow empty strings when switching date format', () => {
    expect(switchToIsoDateFormat('')).toBeUndefined()
  })
})

describe('createQueryParamString()', () => {
  it('should create a query param string', () => {
    const params = {
      agencyId: 'LEI',
      fromDate: '2018-10-10',
      toDate: '2018-10-11',
    }

    expect(createQueryParamString(params)).toEqual('agencyId=LEI&fromDate=2018-10-10&toDate=2018-10-11')
  })

  it('should omit undefined', () => {
    const params = {
      agencyId: 'LEI',
      fromDate: undefined,
      toDate: undefined,
    }

    expect(createQueryParamString(params)).toEqual('agencyId=LEI')
  })

  it('should only accept objects', () => {
    expect(createQueryParamString()).toBeNull()
    expect(createQueryParamString(1)).toBeNull()
    expect(createQueryParamString('test')).toBeNull()
    expect(createQueryParamString(['test'])).toBeNull()
  })
})

describe('createValueString()', () => {
  it('should handle no type', () => {
    expect(createValueString(1)).toEqual(1)
  })

  it('should handle percentages', () => {
    expect(createValueString(50, 'percentage')).toEqual('50%')
  })

  it('should handle a singular day', () => {
    expect(createValueString(1, 'day')).toEqual('1 day')
  })

  it('should handle plural days', () => {
    expect(createValueString(0, 'day')).toEqual('0 days')
    expect(createValueString(2, 'day')).toEqual('2 days')
  })
})
