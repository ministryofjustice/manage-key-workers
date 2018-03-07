import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Error from '../../Error';
import OffenderSearch from "../components/OffenderSearch";

class OffenderSearchContainer extends Component {
  render () {
    if (this.props.error) {
      return <Error {...this.props} />;
    }
    return <OffenderSearch {...this.props} />;
  }
}

OffenderSearchContainer.propTypes = {
  error: PropTypes.string,
  match: PropTypes.object,
  //displayError: PropTypes.func.isRequired,
  jwt: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OffenderSearchContainer);
