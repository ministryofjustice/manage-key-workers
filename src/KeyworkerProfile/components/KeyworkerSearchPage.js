import React from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { withRouter } from 'react-router'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Status from './Status'
import FormPanel from '../../Components/FormPanel'
import '../index.scss'

const KeyworkerSearchPage = ({
  handleSearch,
  history,
  searchText,
  handleSearchTextChange,
  statusFilter,
  handleStatusFilterChange,
}) => (
  <GridRow>
    <GridCol setWidth="two-thirds">
      <FormPanel>
        <form onSubmit={event => handleSearch(event, history)}>
          <label className="form-label" htmlFor="search-text">
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
          <button type="submit" className="button margin-left">
            Search
          </button>
          <div className="pure-u-md-4-12 margin-top" style={{ display: 'block' }}>
            <label className="form-label" htmlFor="status-select">
              Status
            </label>
            <Status filter statusValue={statusFilter} handleStatusChange={handleStatusFilterChange} />
          </div>
        </form>
      </FormPanel>
    </GridCol>
  </GridRow>
)

KeyworkerSearchPage.propTypes = {
  searchText: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleSearchTextChange: PropTypes.func.isRequired,
  handleStatusFilterChange: PropTypes.func.isRequired,
}

const KeyworkerSearchPageWithRouter = withRouter(KeyworkerSearchPage)

export { KeyworkerSearchPage }
export default KeyworkerSearchPageWithRouter
