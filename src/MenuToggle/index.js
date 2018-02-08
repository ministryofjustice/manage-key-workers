import React from 'react';
import PropTypes from 'prop-types';

import './toggle.scss';

function MenuToggle ({ toggleState, onToggle }) {
  return (
    <div id="nav-icon" onClick={onToggle} className={toggleState ? 'open' : ''}>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

MenuToggle.propTypes = {
  toggleState: PropTypes.bool,
  onToggle: PropTypes.func
};

MenuToggle.defaultProps = {
  toggleState: false,
  onToggle: () => {}
};

export default MenuToggle;
