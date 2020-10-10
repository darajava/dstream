import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.module.css';

const Button = (props) => {
  return (
    <button styleName="button" onClick={props.onClick} className="secondary-border secondary-color primary-background">
      {props.children}
    </button>
  );
}

export default CSSModules(Button, styles);
