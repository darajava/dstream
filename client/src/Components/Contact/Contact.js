import React, { Fragment, useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import styles from "./styles.module.css";
import axios from "axios";

const Contact = () => {

  let content;

  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState();
  let [error, setError] = useState();
  let [emailError, setEmailError] = useState(false);

  let submit = () => {
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      setEmailError(true);
      return;
    }

    axios.get('/mail', {
      params: {
        message,
        email,
      }
    })
    .then(function (response) {
      setSuccess(true);
    })
    .catch(function (error) {
      setError(true);
    });
  }


  content = (
    <Fragment>
      Want to set up your own streaming service? Contact us!
      <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      {emailError && <div styleName="email-error">Please Enter Valid Email</div>}
      <textarea placeholder="Enquiry" value={message} onChange={(e) => setMessage(e.target.value)}/>
      <button onClick={submit}>Enquire</button>
    </Fragment>
  );

  if (success) {
    content = (
      <div styleName="success">
        Your message was sent successfully!
      </div>
    );
  }

  if (error) {
    content = (
      <div styleName="error">
        There was a problem sending your message, please email <a>declan@libirel.com</a> to enquire.
      </div>
    );
  }

  return (
    <div styleName="container">
      {content}
    </div>
  );
};

export default CSSModules(Contact, styles, {allowMultiple: true,});
