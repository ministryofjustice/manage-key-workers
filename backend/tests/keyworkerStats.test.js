const { keyworkerStatsFactory } = require('../controllers/keyworkerStats');

describe('Key worker profile controller', async () => {
  const keyworkerApi = {};
  let controller;

  beforeEach(function () {
    keyworkerApi.stats = jest.fn();
    controller = keyworkerStatsFactory(keyworkerApi);
  });

  it('should make two calls in order to pull enough data to calculate change/performance in numbers', async () => {
    await controller.getStatsForStaff({
      locals: {},
      staffId: -5,
      fromDate: '2018-05-10',
      toDate: '2018-05-15'
    });

    expect(keyworkerApi.stats.mock.calls).toEqual([
      [{}, -5, '2018-05-10', '2018-05-15'],
      [{}, -5, '2018-05-05', '2018-05-10']
    ]);
  });


  it('should calculate the increase from past stats', async () => {
    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 10,
      caseNoteSessionCount: 10,
      numberOfProjectedKeyworkerSessions: 1,
      complianceRate: 1
    });

    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 5,
      caseNoteSessionCount: 5,
      numberOfProjectedKeyworkerSessions: 0,
      complianceRate: 0
    });

    const stats =
        await controller.getStatsForStaff({ locals: {}, staffId: -5,
          fromDate: '2018-10-10', toDate: '2018-10-15' });

    const statsByName = getStatsByName(stats);

    const {
      totalNumberOfSessionCaseNotesWritten,
      totalNumberOfEntryAndSessionCaseNoteWritten,
      complianceRate,
      numberOfProjectedKeyworkerSessions
    } = statsByName;

    expect(totalNumberOfSessionCaseNotesWritten.value).toBe(10);
    expect(totalNumberOfSessionCaseNotesWritten.change.value).toBe(5);

    expect(totalNumberOfEntryAndSessionCaseNoteWritten.value).toBe(20);
    expect(totalNumberOfEntryAndSessionCaseNoteWritten.change.value).toBe(10);

    expect(complianceRate.value).toBe(1);
    expect(complianceRate.change.value).toBe(1);

    expect(numberOfProjectedKeyworkerSessions.value).toBe(1);
    expect(numberOfProjectedKeyworkerSessions.change.value).toBe(1);
  });

  it('should calculate the decrease from past stats', async () => {
    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 0,
      caseNoteSessionCount: 0,
      numberOfProjectedKeyworkerSessions: 0,
      complianceRate: 0
    });

    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 10,
      caseNoteSessionCount: 10,
      numberOfProjectedKeyworkerSessions: 1,
      complianceRate: 1
    });

    const stats = await controller
      .getStatsForStaff({ locals: {}, staffId: -5,
        fromDate: '2018-10-10', toDate: '2018-10-15' });

    const statsByName = getStatsByName(stats);

    const {
      totalNumberOfSessionCaseNotesWritten,
      totalNumberOfEntryAndSessionCaseNoteWritten,
      complianceRate,
      numberOfProjectedKeyworkerSessions
    } = statsByName;

    expect(totalNumberOfSessionCaseNotesWritten.value).toBe(0);
    expect(totalNumberOfSessionCaseNotesWritten.change.value).toBe(-10);

    expect(totalNumberOfEntryAndSessionCaseNoteWritten.value).toBe(0);
    expect(totalNumberOfEntryAndSessionCaseNoteWritten.change.value).toBe(-20);

    expect(complianceRate.value).toBe(0);
    expect(complianceRate.change.value).toBe(-1);

    expect(numberOfProjectedKeyworkerSessions.value).toBe(0);
    expect(numberOfProjectedKeyworkerSessions.change.value).toBe(-1);
  });

  it('should work when there has been no change', async () => {
    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 0,
      caseNoteSessionCount: 0,
      numberOfProjectedKeyworkerSessions: 0,
      complianceRate: 0
    });

    keyworkerApi.stats.mockReturnValueOnce({
      caseNoteEntryCount: 0,
      caseNoteSessionCount: 0,
      numberOfProjectedKeyworkerSessions: 0,
      complianceRate: 0
    });

    const stats = await controller
      .getStatsForStaff({ locals: {}, staffId: -5,
        fromDate: '2018-10-10', toDate: '2018-10-15' });

    const statsByName = getStatsByName(stats);

    const {
      totalNumberOfSessionCaseNotesWritten,
      totalNumberOfEntryAndSessionCaseNoteWritten,
      complianceRate,
      numberOfProjectedKeyworkerSessions
    } = statsByName;

    expect(totalNumberOfSessionCaseNotesWritten.value).toBe(0);
    expect(totalNumberOfSessionCaseNotesWritten.change.value).toBe(0);

    expect(totalNumberOfEntryAndSessionCaseNoteWritten.value).toBe(0);
    expect(totalNumberOfEntryAndSessionCaseNoteWritten.change.value).toBe(0);

    expect(complianceRate.value).toBe(0);
    expect(complianceRate.change.value).toBe(0);

    expect(numberOfProjectedKeyworkerSessions.value).toBe(0);
    expect(numberOfProjectedKeyworkerSessions.change.value).toBe(0);
  });

  const getStatsByName = (stats) => stats.reduce((acc, current) => {
    acc[current.name] = current;
    return acc;
  }, {});
});
