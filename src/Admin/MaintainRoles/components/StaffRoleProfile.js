import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import MessageBar from '../../../MessageBar'
import { contextUserType, roleListType, userType } from '../../../types'

class StaffRoleProfile extends Component {
  goBack = (e, history) => {
    e.preventDefault()
    // Return to previous page in history. There can be multiple origin pages.
    history.goBack()
  }

  render() {
    const { roleList, history, handleAdd, handleRemove } = this.props
    const results = roleList.map(a => (
      <tr key={a.roleCode}>
        <td className="row-gutters">{a.roleName}</td>
        <td className="row-gutters">
          <button
            type="button"
            className="button greyButtonNoMinWidth removeButton"
            id={`remove-button-${a.roleCode}`}
            value={a.roleCode}
            onClick={event => {
              handleRemove(event, history)
            }}
          >
            Remove
          </button>
        </td>
      </tr>
    ))

    return (
      <div className="padding-bottom-large">
        <MessageBar {...this.props} />
        <div className="pure-g">
          <div className="pure-u-md-11-12 ">
            <div className="pure-u-md-7-12">
              <div className="padding-bottom-40">
                <table>
                  <thead>
                    <tr>
                      <th>Current roles</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results
                    ) : (
                      <tr>
                        <td className="padding-left font-small row-gutters no-results-row">No roles found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                <button
                  type="button"
                  className="button"
                  id="add-button"
                  onClick={event => {
                    handleAdd(event, history)
                  }}
                >
                  Add role
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

StaffRoleProfile.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  user: userType.isRequired,
  contextUser: contextUserType.isRequired,
  roleList: roleListType.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
}

const StaffRoleProfileWithRouter = withRouter(StaffRoleProfile)

export { StaffRoleProfile }
export default StaffRoleProfileWithRouter
