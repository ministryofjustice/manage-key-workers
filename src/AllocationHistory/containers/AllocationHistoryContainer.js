import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setAllocationHistory, setLoaded } from '../../redux/actions';
import { connect } from 'react-redux';
import AllocationHistory from '../components/AllocationHistory';
import Error from '../../Error';
import { withRouter } from 'react-router';
import Spinner from '../../Spinner';

import axios from 'axios';

class AllocationHistoryContainer extends Component {
  constructor (props) {
    super();
    props.setLoadedDispatch(false);
  }

  async componentDidMount () {
    try {
      await this.getAllocationHistory();
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getAllocationHistory () {
    const response = await axios.get('/api/allocationHistory', {
      params: {
        offenderNo: this.props.match.params.offenderNo
      }
    });

    await this.props.allocationHistoryDispatch(response.data);
  }


  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    if (this.props.loaded) {
      return (<AllocationHistory {...this.props} />);
    }

    return <Spinner />;
  }
}

AllocationHistoryContainer.propTypes = {
  error: PropTypes.string,
  path: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  allocationHistory: PropTypes.object,
  allocationHistoryDispatch: PropTypes.func,
  setLoadedDispatch: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    allocationHistory: state.allocationHistory.allocationHistory,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    allocationHistoryDispatch: allocHistory => dispatch(setAllocationHistory(allocHistory)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { AllocationHistoryContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AllocationHistoryContainer));

