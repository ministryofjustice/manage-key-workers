import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import Status from "./Status";
import "../index.scss";

const KeyworkerSearchPage = ({
  displayBack,
  handleSearch,
  history,
  searchText,
  handleSearchTextChange,
  statusFilter,
  handleStatusFilterChange
}) => {
  return (
    <div>
      {displayBack()}
      <div className="pure-g">
        <div className="pure-u-md-8-12">
          <h1 className="heading-large margin-top">Search for a key worker</h1>
          <div className="searchForm padding-top padding-left-30 padding-right padding-bottom-large">
            <label className="form-label" htmlFor="seachText">
              Key worker name
            </label>
            <input
              type="text"
              className="pure-u-md-9-12 form-control"
              id="search-text"
              name="searchText"
              value={searchText}
              onChange={handleSearchTextChange}
            />
            <button
              className="button margin-left"
              onClick={() => {
                handleSearch(history);
              }}
            >
              Search
            </button>
            <div className="pure-u-md-4-12 margin-top" style={{ display: "block" }}>
              <label className="form-label" htmlFor="status-select">
                Status
              </label>
              <Status
                filter
                statusValue={statusFilter}
                handleStatusChange={handleStatusFilterChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

KeyworkerSearchPage.propTypes = {
  displayBack: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  statusFilter: PropTypes.string,
  history: PropTypes.object,
  handleSearch: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleStatusFilterChange: PropTypes.func.isRequired,
};

const KeyworkerSearchPageWithRouter = withRouter(KeyworkerSearchPage);

export { KeyworkerSearchPage };
export default KeyworkerSearchPageWithRouter;
