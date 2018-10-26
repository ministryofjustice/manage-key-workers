import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const UserSearch = ({
  roleFilterList,
  roleFilter,
  handleRoleFilterChange,
  nameFilter,
  handleNameFilterChange,
  history,
  handleSearch,
  displayBack,
}) => {
  const roleListOptions = roleFilterList
    ? roleFilterList.map(role => (
        <option key={`role_option_${role.roleCode}`} value={role.roleCode}>
          {role.roleName}
        </option>
      ))
    : []

  const roleSelect = (
    <select
      id="role-select"
      name="role-select"
      className="form-control"
      value={roleFilter}
      onChange={handleRoleFilterChange}
    >
      <option key="role_option_all" value="">
        All
      </option>
      {roleListOptions}
    </select>
  )

  return (
    <div className="padding-bottom-large">
      {displayBack()}
      <div className="pure-g">
        <div className="pure-u-md-11-12 ">
          <h1 className="heading-large margin-top" id="page-title">
            Search for staff member
          </h1>
          <div>
            <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large padding-left-30">
              <div className="pure-u-md-4-12">
                <label className="form-label" htmlFor="name-filter">
                  Name or staff NOMIS ID
                </label>
                <input
                  type="text"
                  className="full-width form-control"
                  id="name-filter"
                  name="nameFilter"
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                />
              </div>
              <div className="pure-u-md-3-12 margin-left">
                <label className="form-label" htmlFor="role-select">
                  Filter by role
                </label>
                {roleSelect}
              </div>
              <button
                type="button"
                className="button margin-left margin-top-large"
                id="search-button"
                onClick={() => {
                  handleSearch(history)
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

UserSearch.propTypes = {
  nameFilter: PropTypes.string,
  roleFilter: PropTypes.string,
  handleRoleFilterChange: PropTypes.func.isRequired,
  handleNameFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  roleFilterList: PropTypes.array,
  displayBack: PropTypes.func.isRequired,
  history: PropTypes.object,
}

const UserSearchWithRouter = withRouter(UserSearch)

export { UserSearch }
export default UserSearchWithRouter
