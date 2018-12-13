import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import {
  setKeyworkerSearchText,
  setKeyworkerSearchResults,
  setLoaded,
  setError,
  resetError,
  setKeyworkerStatusFilter,
  setSettings,
} from '../../redux/actions/index'
import KeyworkerSearchResults from '../components/KeyworkerSearchResults'
import Page from '../../Components/Page'

class KeyworkerSearchResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.getKeyworkerList = this.getKeyworkerList.bind(this)
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this)
    this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this)
    this.performSearch = this.performSearch.bind(this)
  }

  componentDidMount() {
    this.getKeyworkerSettings()
    this.performSearch()
  }

  async getKeyworkerSettings() {
    const { keyworkerSettingsDispatch, setErrorDispatch } = this.props

    try {
      const keyworkerSettings = await axios.get('/api/keyworkerSettings')
      keyworkerSettingsDispatch(keyworkerSettings.data)
    } catch (error) {
      setErrorDispatch(error.message)
    }
  }

  async getKeyworkerList(agencyId) {
    const { searchText, statusFilter } = this.props
    const response = await axios.get('/api/keyworkerSearch', {
      params: {
        agencyId,
        searchText,
        statusFilter,
      },
    })
    return response.data
  }

  handleSearchTextChange(event) {
    const { keyworkerSearchTextDispatch } = this.props

    keyworkerSearchTextDispatch(event.target.value)
  }

  handleStatusFilterChange(event) {
    const { keyworkerStatusFilterDispatch } = this.props

    keyworkerStatusFilterDispatch(event.target.value)
  }

  async performSearch() {
    const { agencyId, resetErrorDispatch, setLoadedDispatch, keyworkerSearchResultsDispatch, handleError } = this.props

    resetErrorDispatch()
    setLoadedDispatch(false)
    try {
      const list = await this.getKeyworkerList(agencyId)
      keyworkerSearchResultsDispatch(list)
    } catch (error) {
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  render() {
    return (
      <Page title="Search results">
        <KeyworkerSearchResults
          {...this.props}
          handleSearchTextChange={this.handleSearchTextChange}
          handleStatusFilterChange={this.handleStatusFilterChange}
          handleSearch={this.performSearch}
        />
      </Page>
    )
  }
}

KeyworkerSearchResultsContainer.propTypes = {
  error: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerSearchResultsDispatch: PropTypes.func.isRequired,
  keyworkerSearchTextDispatch: PropTypes.func.isRequired,
  keyworkerStatusFilterDispatch: PropTypes.func.isRequired,
  keyworkerSettingsDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  setErrorDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  keyworkerSettings: PropTypes.shape({}).isRequired,
  loaded: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  searchText: state.keyworkerSearch.searchText,
  statusFilter: state.keyworkerSearch.statusFilter,
  agencyId: state.app.user.activeCaseLoadId,
  keyworkerList: state.keyworkerSearch.keyworkerSearchResults,
  loaded: state.app.loaded,
  keyworkerSettings: state.keyworkerSettings,
})

const mapDispatchToProps = dispatch => ({
  keyworkerSearchResultsDispatch: list => dispatch(setKeyworkerSearchResults(list)),
  keyworkerSearchTextDispatch: text => dispatch(setKeyworkerSearchText(text)),
  keyworkerStatusFilterDispatch: status => dispatch(setKeyworkerStatusFilter(status)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  setErrorDispatch: error => dispatch(setError(error)),
  resetErrorDispatch: () => dispatch(resetError()),
  keyworkerSettingsDispatch: settings => dispatch(setSettings(settings)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyworkerSearchResultsContainer)
