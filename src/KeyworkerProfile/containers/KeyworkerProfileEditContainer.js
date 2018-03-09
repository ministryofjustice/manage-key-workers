import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setKeyworker } from '../../redux/actions/index';
import { connect } from 'react-redux';
import KeyworkerProfileEdit from '../components/KeyworkerProfileEdit';
import Error from '../../Error';
import { withRouter } from 'react-router';

class KeyworkerProfileEditContainer extends Component {
  constructor () {
    super();
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  // to redirect to prfile if keyworker not in context?

  handleSaveChanges (history) {
    console.log("todo: save keyworker changes");
    // save to redux until confirmation on next page?...
  }

  handleCancel (history) {
    history.push(`/keyworker/${this.props.keyworker.staffId}/profile`);
  }

  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }

    return <KeyworkerProfileEdit handleSaveChanges={this.handleSaveChanges} handleCancel={this.handleCancel} {...this.props} />;
  }
}

KeyworkerProfileEditContainer.propTypes = {
  error: PropTypes.string,
  jwt: PropTypes.string.isRequired,
  agencyId: PropTypes.string.isRequired,
  keyworkerDispatch: PropTypes.func,
  keyworker: PropTypes.object,
  setMessageDispatch: PropTypes.func,
  displayError: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    agencyId: state.app.user.activeCaseLoadId,
    keyworker: state.keyworkerSearch.keyworker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    keyworkerDispatch: id => dispatch(setKeyworker(id))
  };
};

export { KeyworkerProfileEditContainer };
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyworkerProfileEditContainer));

