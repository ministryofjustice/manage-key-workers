import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { UserSearch } from "./UserSearch";
import { properCaseName } from "../../../stringUtils";
import PreviousNextNavigation from '../../../PreviousNextNavigation';
// import '../index.scss';

class UserSearchResults extends Component {
  render () {
    const pagination = { perPage: this.props.pageSize, pageNumber: this.props.pageNumber };
    const totalRecords = this.props.totalRecords;
    const results = this.props.userList.map((a, index) => {
      const formattedName = properCaseName(a.lastName) + ', ' + properCaseName(a.firstName);
      return (
        <tr key={a.username}>
          <td className="row-gutters">{formattedName}</td>
          <td className="row-gutters">{a.username}</td>
          <td className="row-gutters"><button className="button" id={`edit-button-${a.username}`} value={index} onClick={(event) => { this.props.handleEdit(event, this.props.history);}}>Edit</button></td>
        </tr>
      );
    }
    );

    return (
      <div>
        <UserSearch {...this.props} />
        <div className="pure-u-md-7-12">
          <div className="padding-bottom-40">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th />
                </tr>
              </thead>
              <tbody>{results.length > 0 ? results : <tr><td className="padding-left font-small row-gutters no-results-row">No users found</td></tr>}</tbody>
            </table>
          </div>
        </div>
        <div className="pure-u-md-7-12">
          <PreviousNextNavigation pagination={pagination} totalRecords={totalRecords} pageAction={(id) => { this.props.handlePageAction(id); }} />
        </div>
      </div>
    );
  }
}

UserSearchResults.propTypes = {
  nameFilter: PropTypes.string,
  roleFilter: PropTypes.string,
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func,
  roleFilterDispatch: PropTypes.func,
  roleFilterListDispatch: PropTypes.func,
  handleRoleFilterChange: PropTypes.func.isRequired,
  handleNameFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handlePageAction: PropTypes.func,
  resetErrorDispatch: PropTypes.func,
  roleFilterList: PropTypes.array,
  userList: PropTypes.array,
  displayBack: PropTypes.func.isRequired,
  history: PropTypes.object,
  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  totalRecords: PropTypes.number
};

const UserSearchWithRouter = withRouter(UserSearchResults);

export { UserSearchResults };
export default UserSearchWithRouter;
