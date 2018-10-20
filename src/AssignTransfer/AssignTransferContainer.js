import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setOffenderSearchText, setOffenderSearchAllocationStatus, setOffenderSearchHousingLocation, setError, setMessage } from '../redux/actions';
import OffenderSearchContainer from './containers/OffenderSearchContainer';
import OffenderResultsContainer from './containers/OffenderResultsContainer';
import Error from '../Error';

class AssignTransferContainer extends Component {
  handleSearchTextChange (event) {
    const { offenderSearchTextDispatch } = this.props;

    offenderSearchTextDispatch(event.target.value);
  }

  handleSearchAllocationStatusChange (event) {
    const { offenderSearchAllocationStatusDispatch } = this.props;

    offenderSearchAllocationStatusDispatch(event.target.value);
  }

  handleSearchHousingLocationChange (event) {
    const { offenderSearchHousingLocationDispatch } = this.props;

    offenderSearchHousingLocationDispatch(event.target.value);
  }

  render () {
    const { initialSearch, displayBack } = this.props;

    return (<div>
      {initialSearch && displayBack()}
      <Error {...this.props} />
      {initialSearch ? (<div className="pure-g">
        <div className="pure-u-md-8-12">
          <h1 className="heading-large margin-top">Search for an offender</h1>
          <OffenderSearchContainer
            handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
            handleSearchAllocationStatusChange={(event) => this.handleSearchAllocationStatusChange(event)}
            handleSearchHousingLocationChange={(event) => this.handleSearchHousingLocationChange(event)} {...this.props} />
        </div>
      </div>) : <OffenderResultsContainer
        handleSearchTextChange={(event) => this.handleSearchTextChange(event)}
        handleSearchAllocationStatusChange={(event) => this.handleSearchAllocationStatusChange(event)}
        handleSearchHousingLocationChange={(event) => this.handleSearchHousingLocationChange(event)} {...this.props}/>}
    </div>);
  }
}

AssignTransferContainer.propTypes = {
  error: PropTypes.string,
  searchText: PropTypes.string,
  allocationStatus: PropTypes.string,
  housingLocation: PropTypes.string,
  initialSearch: PropTypes.bool,
  setErrorDispatch: PropTypes.func.isRequired,
  offenderSearchTextDispatch: PropTypes.func,
  offenderSearchAllocationStatusDispatch: PropTypes.func,
  offenderSearchHousingLocationDispatch: PropTypes.func,
  displayBack: PropTypes.func
};

const mapStateToProps = state => ({
    searchText: state.searchText,
    allocationStatus: state.allocationStatus,
    housingLocation: state.housingLocation,
    page: state.app.page,
    error: state.app.error,
    message: state.app.message,
    agencyId: state.app.user.activeCaseLoadId
  });

const mapDispatchToProps = dispatch => ({
    offenderSearchTextDispatch: text => dispatch(setOffenderSearchText(text)),
    offenderSearchAllocationStatusDispatch: status => dispatch(setOffenderSearchAllocationStatus(status)),
    offenderSearchHousingLocationDispatch: location => dispatch(setOffenderSearchHousingLocation(location)),
    setErrorDispatch: error => dispatch(setError(error)),
    setMessageDispatch: message => dispatch(setMessage(message))
  });

export { AssignTransferContainer };
export default connect(mapStateToProps, mapDispatchToProps)(AssignTransferContainer);
