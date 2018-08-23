import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';
import ProductGlobals from '../product-globals';

import './header.theme.scss';
import { getHomeLink } from "../links";

class Header extends Component {
  componentDidMount () {
    this.props.history.listen((location, action) => {
      this.props.resetError();
    });
  }

  render () {
    return (
      <header className="page-header">
        <div className="header-content">
          <div className="left-content clickable">
            <a title="Home link" className="link" href={getHomeLink()}>
              <div className="logo"><img src="/images/Crest@2x.png" alt="" width="42" height="35"/></div>
            </a>
            <a title="Home link" className="unstyled-link" href={getHomeLink()}>
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
  switchCaseLoad: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired
};

export default Header;
