import React from 'react'
import { shallow } from 'enzyme'
import { KeyworkerDashboard } from './KeyworkerDashboard'
import mockHistory from '../test/mockHistory'

describe('<KeyworkerDashboard />', () => {
  describe('Data available for dates chosen', () => {
    const dateValues = {
      fromDate: '2020-12-01',
      toDate: '2020-12-31',
    }

    const props = {
      agencyId: 'TEST',
      activeCaseLoad: 'Test',
      displayBack: jest.fn(),
      handleError: jest.fn(),
      history: mockHistory,
      migrated: true,
      sequenceFrequency: 1,
      highComplexity: false,
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

    it('calculates the comparison dates as a like-for-like number of days previous - 30 days', () => {
      const wrapper = shallow(<KeyworkerDashboard {...props} />)
      const dates = wrapper.instance().getComparisonDates(dateValues.fromDate, dateValues.toDate)
      expect(dates).toEqual({
        comparisonFromDate: '01 November 2020',
        comparisonToDate: '30 November 2020',
        formattedChosenFromDate: '01 December 2020',
        formattedChosenToDate: '31 December 2020',
      })
    })

    describe('When the key worker sessions frequency is 1 week', () => {
      beforeEach(() => {
        props.sequenceFrequency = 1
      })

      it('a non pluralised sub header', () => {
        const wrapper = shallow(<KeyworkerDashboard {...props} />)

        expect(wrapper.find('SubHeader').render().text()).toEqual(
          'Prisoners in Test have a key worker session every 1 week.'
        )
      })
    })

    describe('When the key worker sessions frequency is 2 weeks', () => {
      beforeEach(() => {
        props.sequenceFrequency = 2
      })

      it('render a pluralised sub header', () => {
        const wrapper = shallow(<KeyworkerDashboard {...props} />)

        expect(wrapper.find('SubHeader').render().text()).toEqual(
          'Prisoners in Test have a key worker session every 2 weeks.'
        )
      })
    })
  })

  describe('Correct subheading depending on whether the prison is high complexity', () => {
    const props = {
      agencyId: 'TEST',
      activeCaseLoad: 'TEST',
      displayBack: jest.fn(),
      handleError: jest.fn(),
      history: mockHistory,
      migrated: true,
      sequenceFrequency: 1,
      dispatchStats: jest.fn(),
      dispatchLoaded: jest.fn(),
      data: [],
      prisonerToKeyWorkerRatio: 6,
      fromDate: '2020-12-01',
      toDate: '2020-12-31',
    }
    it('Shows the high complexity subheading when the prison is high complexity', () => {
      const wrapper = shallow(<KeyworkerDashboard {...props} highComplexity />)
      expect(wrapper.find('SubHeader').at(0).render().text()).toEqual(
        'These statistics do not include people with a high complexity of need level.'
      )
      expect(wrapper.find('SubHeader').at(1).render().text()).toEqual(
        'Prisoners in TEST have a key worker session every 1 week.'
      )
    })

    it('Does not show the high complexity subheading when the prison is not high complexity', () => {
      const wrapper = shallow(<KeyworkerDashboard {...props} highComplexity={false} />)
      expect(wrapper.find('SubHeader').length).toEqual(1)
      expect(wrapper.find('SubHeader').at(0).render().text()).toEqual(
        'Prisoners in TEST have a key worker session every 1 week.'
      )
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
      sequenceFrequency: 1,
      highComplexity: false,
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
