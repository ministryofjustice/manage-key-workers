import { renderDate } from './stringUtils';
import moment from 'moment';

describe('the renderDate function', () => {
  const notPresentString = '--';

  it('should render a value that is not a moment as "--"', () => {
    expect(renderDate()).toBe(notPresentString);
  });

  it('should render a moment as DD/MM/YYYY', () => {
    expect(renderDate(moment({ year: 2018, month: 11, day: 30 }))).toBe('30/12/2018');
  });

  it('should render an ISO 8601 date formatted string (YYYY-MM-DD) as DD/MM/YYYY', () => {
    expect(renderDate('2018-12-30')).toBe('30/12/2018');
  });

  it('should render leading zeros', () => {
    expect(renderDate(moment({ year: 2018, M: 0, day: 1 }))).toBe('01/01/2018');
  });

  it('should render an illegal ISO 8601 formatted string as "--"', () => {
    expect(renderDate('2018-02-29')).toBe(notPresentString);
  });

  it('should render unparsable string as "--"', () => {
    expect(renderDate('abcd')).toBe(notPresentString);
  });

  it('should render null as "--"', () => {
    expect(renderDate(null)).toBe(notPresentString);
  });

  it('should render an object as "--"', () => {
    expect(renderDate({})).toBe(notPresentString);
  });

  it('should render an empty string as "--"', () => {
    expect(renderDate('')).toBe(notPresentString);
  });

  it('should render an integer as "--"', () => {
    expect(renderDate(0)).toBe(notPresentString);
  });

  it('should render a boolean as "--"', () => {
    expect(renderDate(false)).toBe(notPresentString);
  });
});
