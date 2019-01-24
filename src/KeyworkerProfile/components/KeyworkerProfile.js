import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { properCaseName, renderDate, formatDateToLongHand } from '../../stringUtils'
import MessageBar from '../../MessageBar/index'
import { getStatusStyle, getStatusDescription } from '../keyworkerStatus'
import { getOffenderLink } from '../../links'
import KeyworkerStats from './KeyworkerStats'

import {
  userType,
  keyworkerType,
  keyworkerListType,
  keyworkerChangeListType,
  keyworkerAllocationsType,
  configType,
} from '../../types'

class KeyworkerProfile extends Component {
  getAllocationStyle = () => {
    const { keyworkerAllocations, keyworker } = this.props
    let allocationStyleClass = 'numberCircleGreen'
    if (keyworkerAllocations.length === 0) {
      allocationStyleClass = 'numberCircleGrey'
    } else if (keyworkerAllocations.length === keyworker.capacity) {
      allocationStyleClass = 'numberCircleAmber'
    } else if (keyworkerAllocations.length > keyworker.capacity) {
      allocationStyleClass = 'numberCircleRed'
    }
    return allocationStyleClass
  }

  goBack = (e, history) => {
    e.preventDefault()
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack()
  }

  render() {
    const {
      keyworker,
      keyworkerList,
      keyworkerChangeList,
      keyworkerAllocations,
      user,
      handleKeyworkerChange,
      handleAllocationChange,
      history,
      config,
      handleEditProfileClick,
    } = this.props

    const statusStyle = getStatusStyle(keyworker.status)
    const keyworkerOptions = keyworkerList.map(kw => {
      const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)} (${kw.numberAllocated})`
      return (
        <option key={`option_${kw.staffId}`} value={kw.staffId}>
          {formattedDetails}
        </option>
      )
    })
    const allocations = keyworkerAllocations.map((a, index) => {
      const currentSelectValue = keyworkerChangeList[index] ? keyworkerChangeList[index].staffId : ''
      const formattedName = `${properCaseName(a.lastName)}, ${properCaseName(a.firstName)}`
      return (
        <tr key={a.offenderNo}>
          <td className="row-gutters">
            {a.deallocOnly ? (
              formattedName
            ) : (
              <a target="_blank" rel="noopener noreferrer" className="link" href={getOffenderLink(a.offenderNo)}>
                {formattedName}
              </a>
            )}
          </td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{renderDate(a.confirmedReleaseDate)}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
          <td className="row-gutters">{renderDate(a.lastKeyWorkerSessionDate)}</td>
          <td className="row-gutters">{a.numKeyWorkerSessions}</td>
          <td className="row-gutters">
            <select
              disabled={Boolean(!user || !user.writeAccess)}
              id={`keyworker-select-${a.offenderNo}`}
              className="form-control"
              value={currentSelectValue}
              onChange={event => handleKeyworkerChange(event, index, a.offenderNo)}
            >
              <option key="choose" value="--">
                -- No change --
              </option>
              <option key="deallocate" value="_DEALLOCATE">
                -- Deallocate --
              </option>
              {a.deallocOnly ? '' : keyworkerOptions.filter(e => e.props.value !== keyworker.staffId)}
            </select>
          </td>
        </tr>
      )
    })

    let renderContent = null
    const allocationCountStyle = this.getAllocationStyle()

    renderContent = (
      <div>
        {config.keyworkerProfileStatsEnabled === 'true' && keyworker && keyworker.stats && (
          <Fragment>
            <h3 className="heading-medium" data-qa="keyworker-stat-heading">
              {`Statistics for period: `}
              <span className="normal-weight">{` ${formatDateToLongHand(
                keyworker.stats.fromDate
              )} to ${formatDateToLongHand(keyworker.stats.toDate)}`}</span>
            </h3>
            <KeyworkerStats stats={keyworker.stats.data || []} />
            <hr />
          </Fragment>
        )}
        <div className="lede padding-top padding-bottom-large bold">
          Current allocations{' '}
          <div id="allocationCount" className={allocationCountStyle}>
            <div className="adjustCount">{keyworkerAllocations.length}</div>
          </div>
        </div>
        <div className="pure-u-md-12-12">
          <div className="padding-bottom-40">
            <table>
              <thead>
                <tr>
                  <th>Prisoner</th>
                  <th>Prison no.</th>
                  <th>Location</th>
                  <th>Release date</th>
                  <th>CSRA</th>
                  <th>
                    Most recent
                    <br />
                    KW session
                  </th>
                  <th>
                    No. KW sessions
                    <br />
                    in last month
                  </th>
                  <th>
                    Change or deallocate <br />
                    key worker
                  </th>
                </tr>
              </thead>
              <tbody>{allocations}</tbody>
            </table>
          </div>
          {keyworkerAllocations.length > 0 && (user && user.writeAccess) && (
            <button
              type="button"
              id="updateAllocationButton"
              className="button pure-u-md-5-24"
              onClick={() => handleAllocationChange(history)}
            >
              Update key worker allocation
            </button>
          )}
        </div>
      </div>
    )

    return (
      <div>
        <MessageBar {...this.props} />
        <div className="pure-g padding-bottom-large">
          <div className="padding-top">
            <div className="pure-u-md-5-12">
              <div className="pure-u-md-5-12">
                <span className="form-label">Establishment</span>
                <div className="bold padding-top-small">{keyworker.agencyDescription}</div>
              </div>
              <div className="pure-u-md-4-12">
                <span className="form-label">Schedule type</span>
                <div className="bold padding-top-small">{keyworker.scheduleType}</div>
              </div>
              <div className="pure-u-md-1-12">
                <span className="form-label">Capacity</span>
                <div className="bold padding-top-small">{keyworker.capacity}</div>
              </div>
            </div>
            <div className="pure-u-md-7-12">
              <div className="pure-u-md-6-12">
                <span className="form-label">Status</span>
                <div id="keyworker-status" className={`${statusStyle}Status`}>
                  {getStatusDescription(keyworker.status)}
                </div>
              </div>
              {keyworker.status === 'UNAVAILABLE_ANNUAL_LEAVE' && (
                <div className="pure-u-md-3-12 activeDate">
                  <span className="form-label">Return date</span>
                  <div className="bold padding-top-small" id="active-date">
                    {renderDate(keyworker.activeDate)}
                  </div>
                </div>
              )}
              {user && user.writeAccess && (
                <div className="pure-u-md-3-12 right-content">
                  <button
                    type="button"
                    id="editProfileButton"
                    className="button blueButton"
                    onClick={() => handleEditProfileClick(history)}
                  >
                    Edit profile
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr />
          {renderContent}
        </div>
      </div>
    )
  }
}

KeyworkerProfile.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  keyworkerAllocations: keyworkerAllocationsType.isRequired,
  keyworker: keyworkerType.isRequired,
  keyworkerList: keyworkerListType.isRequired,
  keyworkerChangeList: keyworkerChangeListType.isRequired,
  handleAllocationChange: PropTypes.func.isRequired,
  handleKeyworkerChange: PropTypes.func.isRequired,
  handleEditProfileClick: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
  user: userType.isRequired,
  config: configType.isRequired,
}

export default KeyworkerProfile
