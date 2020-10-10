import React from "react";
import CSSModules from "react-css-modules";
import styles from "./header.module.css";

const Header = () => (
  <div styleName="header">
    <img src="/images/dstream.jpeg" />
  </div>
);

export default CSSModules(Header, styles);