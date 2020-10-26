import React, { useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import styles from "./styles.module.css";
import { FaTimes } from "react-icons/fa";
import { withRouter } from "react-router-dom";

const Modal = ({onClose, title, children}) => {

  const [closing, setClosing] = useState(false);

  const close = () => {
    setTimeout(onClose, 170);
    setClosing(true);
  };

  return (
    <div styleName={`modal ${closing ? "closing" : ""}`} key={closing}>
      <div styleName="header">
        <div styleName="first"></div>
        <div styleName="middle">
          {title}
        </div>
        <div styleName="last" onClick={close}>
          <FaTimes/>
        </div>
      </div>
      <div styleName="content">
        {children}
      </div>
    </div>
  );
};

export default CSSModules(Modal, styles, {allowMultiple: true,});
