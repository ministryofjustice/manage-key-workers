import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setKeyworkerSearchText, resetError, setKeyworkerStatusFilter } from '../../redux/actions'
import Page from '../../Components/Page'
import KeyworkerSearchPage from '../components/KeyworkerSearchPage'

class KeyworkerSearchContainer extends Component {
  constructor(props) {
    super()
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this)
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    props.resetErrorDispatch()
    props.keyworkerSearchTextDispatch('')
    props.keyworkerStatusFilterDispatch('')
    props.dispatchLoaded(true)
  }

  handleSearchTextChange = event => {
    const { keyworkerSearchTextDispatch } = this.props

    keyworkerSearchTextDispatch(event.target.value)
  }

  handleStatusFilterChange = event => {
    const { keyworkerStatusFilterDispatch } = this.props

    keyworkerStatusFilterDispatch(event.target.value)
  }

  handleSearch = (event, history) => {
    event.preventDefault()
    history.push('/manage-key-workers/key-worker-search/results')
  }

  render() {
    return (
      <Page title="Search for a key worker">
        <KeyworkerSearchPage
          handleSearchTextChange={this.handleSearchTextChange}
          handleStatusFilterChange={this.handleStatusFilterChange}
          handleSearch={this.handleSearch}
          {...this.props}
        />
      </Page>
    )
  }
}

KeyworkerSearchContainer.propTypes = {
  searchText: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchTextDispatch: PropTypes.func.isRequired,
  keyworkerStatusFilterDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  dispatchLoaded: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  searchText: state.keyworkerSearch.searchText,
  statusFilter: state.keyworkerSearch.statusFilter,
  agencyId: state.app.user.activeCaseLoadId,
  keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
})

const mapDispatchToProps = dispatch => ({
  keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
  keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
  resetErrorDispatch: () => dispatch(resetError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyworkerSearchContainer)
