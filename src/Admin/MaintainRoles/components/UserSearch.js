import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
// import '../index.scss';

class UserSearch extends Component {
  render () {
    const roleListOptions = this.props.roleList ? this.props.roleList.map((role, optionIndex) => {
      return <option key={`role_option_${optionIndex}`} value={role.roleCode}>{role.roleName}</option>;
    }) : [];

    const roleSelect = (<select id="role-select" name="role-select" className="form-control"
      value={this.props.roleFilter}
      onChange={this.props.handleRoleFilterChange}>
      {/* When this is used for a filter we need an 'all' option*/}
      {this.props.roleFilter && <option key="" value="">All</option>}
      {roleListOptions}
    </select>);


    return (
      <div>
        {this.props.displayBack()}
        <div className="pure-g">
          <div className="pure-u-md-12-12 ">
            <h1 className="heading-large margin-top" id="page-title">User access management</h1>
            <div>
              <div className="pure-u-md-11-12 searchForm padding-top padding-bottom-large padding-left-30">
                <div className="pure-u-md-4-12">
                  <label className="form-label" htmlFor="nameFilter">User name</label>
                  <input type="text" className="full-width form-control" id="name-filter" name="nameFilter" value={this.props.nameFilter} onChange={this.props.handleNameFilterChange}/>
                </div>
                <div className="pure-u-md-3-12 margin-left">
                  <label className="form-label" htmlFor="role-select">Filter by role</label>
                  { roleSelect }
                </div>
                <button className="button margin-left margin-top-large" id="search-button" onClick={() => { this.props.handleSearch(this.props.history);}}>Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserSearch.propTypes = {
  nameFilter: PropTypes.string,
  roleFilter: PropTypes.string,
  error: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  nameFilterDispatch: PropTypes.func,
  roleFilterDispatch: PropTypes.func,
  roleListDispatch: PropTypes.func,
  handleRoleFilterChange: PropTypes.func.isRequired,
  handleNameFilterChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func,
  roleList: PropTypes.array,
  displayBack: PropTypes.func.isRequired,
  history: PropTypes.object
};

const UserSearchWithRouter = withRouter(UserSearch);

export { UserSearch };
export default UserSearchWithRouter;
