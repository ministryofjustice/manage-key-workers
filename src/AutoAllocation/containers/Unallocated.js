import React, { Component } from 'react';
import Unallocated from '../components/Unallocated.js';
import PropTypes from 'prop-types';
import axios from 'axios';
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
      if (!this.props.user || !this.props.user.writeAccess) {
        this.props.history.push('/');
        return;
      }
      const list = await this.getUnallocated(this.props.agencyId);
      this.props.unallocatedListDispatch(list);
    } catch (error) {
      this.props.handleError(error);
    }
    this.props.setLoadedDispatch(true);
  }

  async getUnallocated (agencyId) {
    const response = await axios.get('/api/unallocated', {
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
  handleError: PropTypes.func.isRequired,
  unallocatedList: PropTypes.array,
  agencyId: PropTypes.string.isRequired,
  unallocatedListDispatch: PropTypes.func.isRequired,
  setMessageDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func,
  loaded: PropTypes.bool,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
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
