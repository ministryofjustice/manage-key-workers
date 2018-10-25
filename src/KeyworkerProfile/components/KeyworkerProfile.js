import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { properCaseName, renderDate } from '../../stringUtils'
import MessageBar from '../../MessageBar/index'
import { getStatusStyle, getStatusDescription } from '../keyworkerStatus'
import { getOffenderLink } from '../../links'
import KeyworkerStats from './KeyworkerStats'

class KeyworkerProfile extends Component {
  constructor(props) {
    super(props)
    this.goBack = this.goBack.bind(this)
  }

  getAllocationStyle() {
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

  goBack(e, history) {
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
    const keyworkerDisplayName = `${properCaseName(keyworker.firstName)} ${properCaseName(keyworker.lastName)}`
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
        {config.keyworkeProfileStatsEnabled === 'true' && (
          <Fragment>
            <KeyworkerStats stats={(keyworker && keyworker.stats) || []} />
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
                    Last key
                    <br />
                    worker activity
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
          {keyworkerAllocations.length > 0 &&
            (user && user.writeAccess) && (
              <button
                type="button"
                id="updateAllocationButton"
                className="button pure-u-md-5-24"
                onClick={() => handleAllocationChange(history)}
              >
                Update keyworker allocation
              </button>
            )}
        </div>
      </div>
    )

    return (
      <div>
        <MessageBar {...this.props} />
        <div className="pure-g padding-bottom-large">
          <div className="pure-u-md-8-12 padding-top">
            <a href="#back" title="Back link" className="link backlink" onClick={event => this.goBack(event, history)}>
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
            </a>
            <h1 className="heading-large margin-top">Key worker: {keyworkerDisplayName}</h1>
          </div>
          <div className="padding-top">
            <div className="pure-u-md-5-12">
              <div className="pure-u-md-5-12">
                <label className="form-label" htmlFor="name">
                  Establishment
                </label>
                <div className="bold padding-top-small">{keyworker.agencyDescription}</div>
              </div>
              <div className="pure-u-md-4-12">
                <label className="form-label" htmlFor="name">
                  Schedule type
                </label>
                <div className="bold padding-top-small">{keyworker.scheduleType}</div>
              </div>
              <div className="pure-u-md-1-12">
                <label className="form-label" htmlFor="name">
                  Capacity
                </label>
                <div className="bold padding-top-small">{keyworker.capacity}</div>
              </div>
            </div>
            <div className="pure-u-md-7-12">
              <div className="pure-u-md-6-12">
                <label className="form-label" htmlFor="name">
                  Status
                </label>
                <div id="keyworker-status" className={`${statusStyle}Status`}>
                  {getStatusDescription(keyworker.status)}
                </div>
              </div>
              {keyworker.status === 'UNAVAILABLE_ANNUAL_LEAVE' && (
                <div className="pure-u-md-3-12 activeDate">
                  <label className="form-label" htmlFor="name">
                    Return date
                  </label>
                  <div className="bold padding-top-small" id="active-date">
                    {renderDate(keyworker.activeDate)}
                  </div>
                </div>
              )}
              {user &&
                user.writeAccess && (
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
  history: PropTypes.object,
  keyworkerAllocations: PropTypes.array,
  keyworker: PropTypes.object.isRequired,
  keyworkerList: PropTypes.array,
  keyworkerChangeList: PropTypes.array,
  handleAllocationChange: PropTypes.func.isRequired,
  handleKeyworkerChange: PropTypes.func.isRequired,
  handleEditProfileClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  loaded: PropTypes.bool,
  user: PropTypes.object.isRequired,
}

export default KeyworkerProfile
