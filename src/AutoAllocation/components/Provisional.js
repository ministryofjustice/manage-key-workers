import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { properCaseName, renderDate } from '../../stringUtils'
import DateFilter from '../../DateFilter/index'
import { getOffenderLink, getStaffLink } from '../../links'

class Provisional extends Component {
  getKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated) {
    if (staffId) {
      return (
        <a className="link" target="_blank" rel="noopener noreferrer" href={getStaffLink(staffId)}>
          {this.buildKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated)}
        </a>
      )
    }
    return <strong className="bold-xsmall">Not allocated</strong>
  }

  buildKeyworkerDisplay(staffId, keyworkerDisplay, numberAllocated) {
    if (keyworkerDisplay !== '--') {
      if (numberAllocated || numberAllocated === 0) {
        return `${keyworkerDisplay} (${numberAllocated})`
      }
      return keyworkerDisplay
    }
    return `${staffId} (no details available)`
  }

  buildTableForRender(keyworkerOptions) {
    const { allocatedList, allocatedKeyworkers, handleKeyworkerChange } = this.props
    const offenders = allocatedList.map((a, index) => {
      const currentSelectValue = allocatedKeyworkers[index] ? allocatedKeyworkers[index].staffId : ''
      return (
        <tr key={a.offenderNo} className="row-gutters">
          <td className="row-gutters">
            <a target="_blank" rel="noopener noreferrer" className="link" href={getOffenderLink(a.offenderNo)}>
              {properCaseName(a.lastName)}, {properCaseName(a.firstName)}
            </a>
          </td>
          <td className="row-gutters">{a.offenderNo}</td>
          <td className="row-gutters">{a.internalLocationDesc}</td>
          <td className="row-gutters">{renderDate(a.confirmedReleaseDate)}</td>
          <td className="row-gutters">{a.crsaClassification || '--'}</td>
          <td className="row-gutters">{this.getKeyworkerDisplay(a.staffId, a.keyworkerDisplay, a.numberAllocated)}</td>
          <td className="row-gutters">
            <select
              id={`keyworker-select-${a.offenderNo}`}
              className="form-control"
              value={currentSelectValue}
              onChange={event => handleKeyworkerChange(event, index, a.offenderNo)}
            >
              <option key="choose" value="--">
                -- Select --
              </option>
              {keyworkerOptions.filter(e => e.props.value !== a.staffId)}
            </select>
          </td>
        </tr>
      )
    })
    return offenders
  }

  render() {
    const { keyworkerList, postManualOverride, onFinishAllocation, history, displayDateFilter } = this.props
    const keyworkerOptions = keyworkerList.map((kw, optionIndex) => {
      const formattedDetails = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)} (${kw.numberAllocated})`
      return (
        <option key={`option_${optionIndex}_${kw.staffId}`} value={kw.staffId}>
          {formattedDetails}
        </option>
      )
    })

    const offenders = this.buildTableForRender(keyworkerOptions)

    const buttons = (
      <div>
        <button type="button" className="button button-save" onClick={() => postManualOverride(history)}>
          Confirm allocation
        </button>
        <button
          type="button"
          className="button greyButton button-cancel margin-left"
          onClick={() => onFinishAllocation(history)}
        >
          Cancel allocation
        </button>
      </div>
    )

    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-md-7-12">
            <Link id="back_link" title="Back link" className="link backlink" to="/unallocated">
              <img className="back-triangle" src="/images/BackTriangle.png" alt="" width="6" height="10" /> Back
            </Link>
            <h1 className="heading-large">Suggested key worker allocation</h1>
          </div>
          {displayDateFilter && (
            <div className="pure-u-md-5-12">
              <DateFilter {...this.props} />
            </div>
          )}
        </div>
        {offenders.length >= 20 && <div className="padding-top padding-bottom-large">{buttons}</div>}
        <div className="padding-bottom-40">
          <table className="row-gutters">
            <thead>
              <tr>
                <th>Prisoner</th>
                <th>Prison no.</th>
                <th>Location</th>
                <th>CRD</th>
                <th>CSRA</th>
                <th>Allocated Key worker</th>
                <th>Allocate to new key worker</th>
              </tr>
            </thead>
            <tbody>{offenders}</tbody>
          </table>
        </div>
        {buttons}
      </div>
    )
  }
}

Provisional.propTypes = {
  displayDateFilter: PropTypes.bool,
  allocatedList: PropTypes.array,
  keyworkerList: PropTypes.array,
  history: PropTypes.object,
  allocatedKeyworkers: PropTypes.array,
  handleKeyworkerChange: PropTypes.func.isRequired,
  postManualOverride: PropTypes.func.isRequired,
  onFinishAllocation: PropTypes.func.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
}

export { Provisional }
export default withRouter(Provisional)
