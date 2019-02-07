import React from 'react'
import { shallow } from 'enzyme'
import { KeyworkerDashboard } from './KeyworkerDashboard'
import mockHistory from '../test/mockHistory'

describe('<KeyworkerDashboard />', () => {
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

    expect(
      wrapper
        .find('NoDataMessage')
        .render()
        .text()
    ).toEqual('There is no data for this period.')
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
