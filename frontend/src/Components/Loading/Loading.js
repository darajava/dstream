import React from 'react';
import styles from './styles.module.css';
import CSSModules from 'react-css-modules';

const Loading = ({fullScreen}) => {
  return (
    <div styleName={`container ${fullScreen ? "full-screen" : "" }`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-eclipse"><path ng-attr-d="{{config.pathCmd}}" ng-attr-fill="{{config.color}}" stroke="none" d="M30 50A20 20 0 0 0 70 50A20 22 0 0 1 30 50" fill="#000000" transform="rotate(44.8974 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1.2s" begin="0s" repeatCount="indefinite"></animateTransform></path></svg>
    </div>
  );
}

export default CSSModules(Loading, styles, {allowMultiple: true});
