import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker, setKeyworkerStatusChangeBehaviour } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEditConfirm from '../components/KeyworkerProfileEditConfirm';
import Error from '../../Error';
import { withRouter } from 'react-router';
import { setMessage } from "../../redux/actions";
import axiosWrapper from "../../backendWrapper";

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount () {
    //someone has deeplinked  - send back to profile page
    if (!this.props.status) {
      this.props.history.push(`/keyworker/${this.props.match.params.staffId}/profile`);
    }
  }

  // to redirect to prfile if keyworker not in context?

  async handleSaveChanges (history) {
    console.log("todo: save keyworker changes");
    await this.postKeyworkerUpdate();
    this.props.setMessageDispatch("Status updated");
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
  }

  async postKeyworkerUpdate () {
    try {
      await axiosWrapper.post('/api/keyworkerUpdate',
        {
          keyworker:
            {
              status: this.props.status || this.props.keyworker.status,
              capacity: this.props.capacity || this.props.keyworker.capacity
            }
        },
        {
          params:
            {
              agencyId: this.props.agencyId,
              staffId: this.props.keyworker.staffId
            }
        });
    } catch (error) {
      this.props.displayError(error);
    }
  }

  handleCancel (history) {
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile/edit`);
  }

  handleOptionChange (event) {
    this.props.setStatusChangeBehaviourDispatch(event.target.value);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfileEditConfirm handleSaveChanges={this.handleSaveChanges} handleCancel={this.handleCancel} handleOptionChange={this.handleOptionChange} {...this.props} />;
  }
}

KeyworkerProfileEditContainer.propTypes = {
  error: PropTypes.string,
  status: PropTypes.string,
  capacity: PropTypes.string,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  setStatusChangeBehaviourDispatch: PropTypes.func,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker,
    status: state.keyworkerSearch.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: object => dispatch(setKeyworker(object)),
    setMessageDispatch: (message) => dispatch(setMessage(message)),
    setStatusChangeBehaviourDispatch: (message) => dispatch(setKeyworkerStatusChangeBehaviour(message))
  };
};

export { KeyworkerProfileEditContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer));

