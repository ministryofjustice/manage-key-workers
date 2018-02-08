import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import ProductGlobals from '../product-globals';

import './header.theme.scss';
import './index.scss';

class Header extends Component {
  constructor (props) {
    super(props);

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  openMenu () {
    this.props.setMobileMenuOpen(true);
  }

  closeMenu () {
    this.props.setMobileMenuOpen(false);
  }

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
              {this.props.user && <Dropdown {...this.props} /> }
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
  mobileMenuOpen: PropTypes.bool,
  setMobileMenuOpen: PropTypes.func,
  switchCaseLoad: PropTypes.func.isRequired
};

Header.defaultProps = {
  user: undefined,
  options: {
    assignments: 12,
    facilities: ['Sheffield', 'Cloverfield']
  },
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {}
};

export default Header;
