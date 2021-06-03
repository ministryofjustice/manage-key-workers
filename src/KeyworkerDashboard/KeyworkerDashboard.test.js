import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import { KeyworkerDashboard } from './KeyworkerDashboard'
import mockHistory from '../test/mockHistory'

describe('<KeyworkerDashboard />', () => {
  describe('Data available for dates chosen', () => {
    it('calculates the comparison dates as a like-for-like number of days previous - 30 days', () => {
      // chosen dates come in the format YYYY-MM-DD
      const dateValues = {
        fromDate: '2020-12-01',
        toDate: '2020-12-31',
      }

      const props = {
        agencyId: 'TEST',
        activeCaseLoad: 'TEST',
        displayBack: jest.fn(),
        handleError: jest.fn(),
        history: mockHistory,
        migrated: true,
        dispatchStats: jest.fn(),
        dispatchLoaded: jest.fn(),
        data: [
          {
            heading: '',
            value: 1,
            type: '',
            name: '',
          },
        ],
        prisonerToKeyWorkerRatio: 6,
        ...dateValues,
        store: () => {},
      }

      const wrapper = shallow(<KeyworkerDashboard {...props} />)
      const dates = wrapper.instance().getComparisonDates(dateValues.fromDate, dateValues.toDate)
      expect(dates).toEqual({ comparisonFromDate: '01 November 2020', comparisonToDate: '30 November 2020' })
    })

    it('calculates the comparison dates when no fromDate and toDate have been chosen - default dates', () => {
      // default dates come in the format YYYY-MM-DD
      const dateValues = {
        fromDate: '',
        toDate: '',
      }

      const props = {
        agencyId: 'TEST',
        activeCaseLoad: 'TEST',
        displayBack: jest.fn(),
        handleError: jest.fn(),
        history: mockHistory,
        migrated: true,
        dispatchStats: jest.fn(),
        dispatchLoaded: jest.fn(),
        data: [
          {
            heading: '',
            value: 1,
            type: '',
            name: '',
          },
        ],
        prisonerToKeyWorkerRatio: 6,
        ...dateValues,
        store: () => {},
      }

      const lastMonth = moment().subtract(2, 'months')
      const firstDay = lastMonth.startOf('month').format('DD MMMM YYYY')
      const lastDay = lastMonth.endOf('month').format('DD MMMM YYYY')
      const expectedDates = { comparisonFromDate: firstDay, comparisonToDate: lastDay }

      const wrapper = shallow(<KeyworkerDashboard {...props} />)
      const dates = wrapper.instance().getComparisonDates(dateValues.fromDate, dateValues.toDate)
      expect(dates).toEqual(expectedDates)
    })
  })

  describe('No data for dates chosen', () => {
    const dateValues = {
      fromDate: '01/12/2018',
      toDate: '31/12/2018',
    }

    const props = {
      agencyId: 'TEST',
      activeCaseLoad: 'TEST',
      displayBack: jest.fn(),
      handleError: jest.fn(),
      history: mockHistory,
      migrated: true,
      dispatchStats: jest.fn(),
      dispatchLoaded: jest.fn(),
      data: [],
      prisonerToKeyWorkerRatio: 6,
      ...dateValues,
    }

    it('render a message saying there is no data to display if there is no data', () => {
      const wrapper = shallow(<KeyworkerDashboard {...props} />)

      expect(wrapper.find('NoDataMessage').render().text()).toEqual('There is no data for this period.')
    })

    describe('onSubmit()', () => {
      it('should load stats for the date range in the correct format', () => {
        const wrapper = shallow(<KeyworkerDashboard {...props} />)
        const spy = jest.spyOn(wrapper.instance(), 'loadStatsForPeriod')

        wrapper.instance().onSubmit(dateValues)
        expect(spy).toHaveBeenCalledWith('2018-12-01', '2018-12-31')
      })
    })
  })
})
