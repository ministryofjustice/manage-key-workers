import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import axios from 'axios'
import OffenderResults from '../components/OffenderResults'
import Page from '../../Components/Page'

import { resetError, setKeyworkerChangeList, setLoaded, setOffenderSearchResults } from '../../redux/actions'
import { keyworkerListType, keyworkerChangeListType, locationsType } from '../../types'

class OffenderResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.doSearch = this.doSearch.bind(this)
    this.handleKeyworkerChange = this.handleKeyworkerChange.bind(this)
    this.postManualOverride = this.postManualOverride.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentWillMount() {
    const { locations, history } = this.props

    /* if arriving from a page refresh - redirect to initial search */
    if (!locations || locations.length === 0) {
      history.push({
        pathname: '/offender-search',
        state: { initialSearch: true },
      })
    } else {
      await this.doSearch()
    }
  }

  handleSubmit() {
    this.doSearch()
  }

  async doSearch() {
    const {
      resetErrorDispatch,
      setLoadedDispatch,
      housingLocation,
      searchText,
      allocationStatus,
      agencyId,
      keyworkerChangeListDispatch,
      offenderSearchResultsDispatch,
      handleError,
    } = this.props

    resetErrorDispatch()
    setLoadedDispatch(false)
    try {
      const response = await axios.get('/api/searchOffenders', {
        params: {
          locationPrefix: housingLocation,
          keywords: searchText,
          allocationStatus,
          agencyId,
        },
      })
      const { data } = response
      keyworkerChangeListDispatch([])
      offenderSearchResultsDispatch(data)
    } catch (error) {
      offenderSearchResultsDispatch({
        keyworkerResponse: [],
        offenderResponse: [],
      })
      handleError(error)
    }
    setLoadedDispatch(true)
  }

  handleKeyworkerChange(event, index, offenderNo) {
    const { keyworkerChangeList, keyworkerChangeListDispatch } = this.props
    const changeList = keyworkerChangeList ? [...keyworkerChangeList] : []

    if (event.target.value === '--') {
      changeList[index] = null
    } else if (event.target.value === '_DEALLOCATE') {
      changeList[index] = {
        deallocate: true,
        staffId: event.target.value,
        offenderNo,
      }
    } else {
      changeList[index] = {
        staffId: event.target.value,
        offenderNo,
      }
    }
    keyworkerChangeListDispatch(changeList)
  }

  async postManualOverride() {
    const { agencyId, keyworkerChangeList, setMessageDispatch, handleError } = this.props

    try {
      if (keyworkerChangeList && keyworkerChangeList.length > 0) {
        await axios.post('/api/manualoverride', { allocatedKeyworkers: keyworkerChangeList }, { params: { agencyId } })
        setMessageDispatch('Key workers successfully updated.')
        await this.doSearch()
      }
    } catch (error) {
      handleError(error)
    }
  }

  render() {
    return (
      <Page title="Change key workers" alwaysRender>
        <OffenderResults
          handleKeyworkerChange={this.handleKeyworkerChange}
          postManualOverride={this.postManualOverride}
          doSearch={this.doSearch}
          handleSubmit={this.handleSubmit}
          {...this.props}
        />
      </Page>
    )
  }
}

OffenderResultsContainer.propTypes = {
  error: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  allocationStatus: PropTypes.string.isRequired,
  housingLocation: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  offenderSearchResultsDispatch: PropTypes.func.isRequired,
  keyworkerChangeListDispatch: PropTypes.func.isRequired,
  keyworkerChangeList: keyworkerChangeListType.isRequired,
  keyworkerList: keyworkerListType.isRequired,
  locations: locationsType.isRequired,
  handleError: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  resetErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  message: PropTypes.string.isRequired,
  validationErrors: PropTypes.shape({}).isRequired,
}

const mapStateToProps = state => ({
  searchText: state.offenderSearch.searchText,
  allocationStatus: state.offenderSearch.allocationStatus,
  keyworkerList: state.keyworkerSearch.keyworkerList,
  keyworkerChangeList: state.keyworkerSearch.keyworkerChangeList,
  housingLocation: state.offenderSearch.housingLocation,
  offenderResults: state.offenderSearch.offenderResults,
  agencyId: state.app.user.activeCaseLoadId,
  locations: state.offenderSearch.locations,
  loaded: state.app.loaded,
  message: state.app.message,
  validationErrors: state.app.validationErrors,
})

const mapDispatchToProps = dispatch => ({
  offenderSearchResultsDispatch: resultList => dispatch(setOffenderSearchResults(resultList)),
  keyworkerChangeListDispatch: list => dispatch(setKeyworkerChangeList(list)),
  setLoadedDispatch: status => dispatch(setLoaded(status)),
  resetErrorDispatch: () => dispatch(resetError()),
})

export { OffenderResultsContainer }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OffenderResultsContainer))
