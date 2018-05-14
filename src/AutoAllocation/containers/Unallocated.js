import React, { Component } from 'react';
import Unallocated from '../components/Unallocated.js';
import PropTypes from 'prop-types';
import axiosWrapper from '../../backendWrapper';
import { setUnallocatedList, setMessage, setLoaded } from '../../redux/actions/index';
import ErrorComponent from '../../Error/index';
import { connect } from 'react-redux';
import Spinner from '../../Spinner/index';
import { withRouter } from 'react-router';

import '../../allocation.scss';

class UnallocatedContainer extends Component {
  constructor (props) {
    super();
    this.gotoManualAllocation = this.gotoManualAllocation.bind(this);
    props.unallocatedListDispatch([]);
    props.setLoadedDispatch(false);
  }

  async componentWillMount () {
    try {
      const list = await this.getUnallocated(this.props.agencyId);
      this.props.unallocatedListDispatch(list);
    } catch (error) {
      this.props.displayError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getUnallocated (agencyId) {
    const response = await axiosWrapper.get('/api/unallocated', {
      params: {
        agencyId: agencyId
      }
    });
    return response.data;
  }

  async gotoManualAllocation (history) {
    history.push(`/provisionalAllocation`);
  }

  render () {
    if (this.props.loaded) {
      return (<div>
        <ErrorComponent {...this.props} />
        {<Unallocated gotoNext={this.gotoManualAllocation} {...this.props} />}
      </div>
      );
    }
    return <Spinner />;
  }
}

UnallocatedContainer.propTypes = {
  error: PropTypes.string,
  displayError: PropTypes.func.isRequired,
  unallocatedList: PropTypes.array,
  agencyId: PropTypes.string.isRequired,
  unallocatedListDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func,
  loaded: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    unallocatedList: state.unallocated.unallocatedList,
    allocatedKeyworkers: state.allocated.allocatedKeyworkers,
    message: state.app.message,
    agencyId: state.app.user.activeCaseLoadId,
    loaded: state.app.loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    unallocatedListDispatch: list => dispatch(setUnallocatedList(list)),
    setMessageDispatch: message => dispatch(setMessage(message)),
    setLoadedDispatch: (status) => dispatch(setLoaded(status))
  };
};

export { UnallocatedContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UnallocatedContainer));