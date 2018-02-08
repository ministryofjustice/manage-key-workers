import React from 'react';
import PropTypes from 'prop-types';

import './footer.scss';

function Footer ({ modalData, setModalOpen, setModalData }) {
  const linkClick = (e) => {
    setModalOpen(true);
    setModalData(modalData[e.currentTarget.dataset.name]);
  };

  return (
    <footer className="FooterContainer" data-name={'Footer'}>
      <div className="footer-content">
        <div className="FooterLinksContainer">
          <div className="FooterLink" data-name={'terms'} onClick={linkClick}>Terms and conditions</div>
        </div>
        <div className="FooterSignature">Powered by Syscon Justice Systems</div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  setModalOpen: PropTypes.func.isRequired,
  setModalData: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired
};

Footer.defaultProps = {

};

export default Footer;
