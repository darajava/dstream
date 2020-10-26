import React from 'react';
import styles from './styles.module.css';
import CSSModules from 'react-css-modules';

const Loading = ({fullScreen, label}) => {
  return (
    <div styleName={`container ${fullScreen ? "full-screen" : "" }`}>
      <div styleName="loadingio-spinner-rolling-vepf6sanmtm"><div styleName="ldio-9fgab1bhuia">
      <div></div>
      </div></div>
      <div>{label}</div>
    </div>
  );
}

export default CSSModules(Loading, styles, {allowMultiple: true});
