import React from 'react';
import PropTypes from 'prop-types';

import './footer.scss';

const Footer = ({ showTermsAndConditions, mailTo }) =>
  (<footer className="FooterContainer">
    <div className="footer-content">
      <div className="FooterLinksContainer">
        <div className="FooterLink"><a onClick={showTermsAndConditions}>Terms and conditions</a></div>
        <div className="FooterLink">Email&nbsp;&nbsp;<a href={"mailto:" + mailTo}>{mailTo}</a></div>
      </div>
    </div>
  </footer>);

Footer.propTypes = {
  showTermsAndConditions: PropTypes.func.isRequired,
  mailTo: PropTypes.string
};

Footer.defaultProps = {
  mailTo: '',
};

export default Footer;
