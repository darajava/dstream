import React from "react";
import CSSModules from 'react-css-modules';
import styles from './footer.module.scss';

const Footer = ({onClick, theme}) => {
  return (
    <div styleName={`footer ${theme || "light"}`}>
      <div>
        Powered by <img src="./images/dstream-solo.jpeg" styleName="dstream-logo" onClick={onClick}/>
      </div>
      <div>
        &copy; 2020 all rights reserved
      </div>
    </div>
  );
}

export default CSSModules(Footer, styles, {allowMultiple: true});