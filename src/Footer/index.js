import React from 'react';
import PropTypes from 'prop-types';
//import { connect } from 'react-redux';
//import { createStructuredSelector } from 'reselect';

//import { showTerms } from 'globalReducers/app';

import './footer.scss';

const Footer = ({ showTermsAndConditions }) =>
  (<footer className="FooterContainer">
    <div className="footer-content">
      <div className="FooterLinksContainer">
        <div className="FooterLink" onClick={() => showTermsAndConditions()}>Terms and conditions</div>
      </div>
      <div className="FooterSignature">Powered by TBC</div>
    </div>
  </footer>);

Footer.propTypes = {
  showTermsAndConditions: PropTypes.func.isRequired
};

Footer.defaultProps = {
};

/*const mapStateToProps = createStructuredSelector({

});

const mapDispatchToProps = (dispatch) => ({
  showTermsAndConditions: () => dispatch(showTerms())
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);*/
export default Footer;
