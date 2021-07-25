import React from 'react';
import './Loader.scss'

function Loader() {
  return (
    <div className="wrapper_loader">
      <div className="loading_spinner"></div>
      <div className="loading_dots">
        <div className="dot1"></div>
        <div className="dot2"></div>
        <div className="dot3"></div>
      </div>
    </div>
  );
}

export default Loader;
