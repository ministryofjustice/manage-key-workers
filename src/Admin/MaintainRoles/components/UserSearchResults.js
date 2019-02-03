import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import { UserSearch } from './UserSearch'
import { properCaseName } from '../../../stringUtils'
import PreviousNextNavigation from '../../../PreviousNextNavigation'
import { roleFilterListType, userListType } from '../../../types'

const UserSearchResults = props => {
  const { pageSize, pageNumber, totalRecords, userList, handlePageAction, handleEdit, history } = props
  const pagination = { perPage: pageSize, pageNumber }
  const results = userList.map((a, index) => {
    const formattedName = `${properCaseName(a.lastName)}, ${properCaseName(a.firstName)}`
    return (
      <tr key={a.username}>
        <td className="row-gutters">{formattedName}</td>
        <td className="row-gutters width13em">{a.username}</td>
        <td className="row-gutters width5em">{a.activeCaseLoadId}</td>
        <td className="row-gutters width5em">{a.active ? 'Yes' : 'No'}</td>
        <td className="row-gutters width5em">
          <button
            type="button"
            className="button greyButtonNoMinWidth"
            id={`edit-button-${a.username}`}
            value={index}
            onClick={event => {
              handleEdit(event, history)
            }}
          >
            Edit
          </button>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <UserSearch {...props} />
      <div className="pure-u-md-7-12">
        <div className="padding-bottom-40">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Active Caseload</th>
                <th>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results
              ) : (
                <tr>
                  <td className="padding-left font-small row-gutters no-results-row">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pure-u-md-7-12">
        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalRecords}
          pageAction={id => {
            handlePageAction(id)
          }}
        />
      </div>
    </div>
  )
}

UserSearchResults.propTypes = {
  nameFilter: PropTypes.string.isRequired,
  roleFilter: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func.isRequired,
  roleFilterDispatch: PropTypes.func.isRequired,
  roleFilterListDispatch: PropTypes.func.isRequired,
  handleRoleFilterChange: PropTypes.func.isRequired,
  handleNameFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handlePageAction: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  roleFilterList: roleFilterListType.isRequired,
  userList: userListType.isRequired,
  displayBack: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  pageNumber: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
}

const UserSearchWithRouter = withRouter(UserSearchResults)

export { UserSearchResults }
export default UserSearchWithRouter
