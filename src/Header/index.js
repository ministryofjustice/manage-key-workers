import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import ProductGlobals from '../product-globals';

import './header.theme.scss';
import './index.scss';

class Header extends Component {
  render () {
    return (
      <header className="page-header">
        <div className="header-content">
          <div className="left-content">
            <a href="/">
              <div className="logo header-image" />
            </a>
            <a className="unstyled-link" href="/">
              <span className="logo-text">HMPPS</span>
              <span className="title">{ProductGlobals.serviceName}</span>
            </a>
          </div>
          <div className="right-content">
            <div className="right-menu">
              {this.props.user && this.props.user.activeCaseLoadId && <Dropdown {...this.props} /> }
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
  switchCaseLoad: PropTypes.func.isRequired
};

export default Header;
