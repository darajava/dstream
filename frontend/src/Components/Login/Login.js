import React, { useState, useEffect, Fragment } from "react";
import CSSModules from "react-css-modules";
import styles from './login.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {

  const [loggingIn, setLoggingIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);

  const history = useHistory();

  const toggleLogin = (e) => {
    e.preventDefault();

    clearErrors();
    setLoggingIn(!loggingIn);
  }

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
  }

  const register = e => {
    e.preventDefault();
    
    clearErrors();
    let hadError = false;

    if (!validateEmail(email)) {
      setEmailError("Invalid email");
      hadError = true;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hadError = true;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords do not match");
      hadError = true;
    }

    if (!hadError) {
      axios.post(
        '/users/register',
        { email, password }
      )
        .then(res => {
          console.log(res);
        })
        .catch(err => {

        });
    }

  }

  const login = e => {
    e.preventDefault();
    
    let hadError = false;
    if (!email) {
      hadError = true;
      setEmailError("Please enter email");
    }

    if (!password) {
      hadError = true;
      setPasswordError("Please enter password");
    }

    if (!hadError) {
      axios.post(
        '/users/login',
        { email, password }
      )
        .then(res => {
          console.log(res.data);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("accessToken", res.data.accessToken);

          history.push("/profile");
        })
        .catch(err => {
          setPasswordError("Incorrect username or password");
        });
    }
  }

  return (
    <div styleName="login">
      <Header />

      <div styleName="form-container">
        <form styleName="form" onSubmit={loggingIn ? login : register}>
          <div styleName="heading">
            {loggingIn ? "Login" : "Register"}
          </div>

          <div styleName="row">
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} name="email" />
            {emailError && <div styleName="error">{emailError}</div>}
          </div>

          <div styleName="row">
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} name="password" />
            {passwordError && <div styleName="error">{passwordError}</div>}
          </div>


          {!loggingIn && 
            (
              <Fragment>
                <div styleName="row">
                  <input placeholder="Repeat password" type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
                  {repeatPasswordError && <div styleName="error">{repeatPasswordError}</div>}
                </div>
              </Fragment>
            )
          }

          <button styleName="submit" type="submit">
            {loggingIn ? "Log in" : "Register"}
          </button>

          {loggingIn
            ?
            <div styleName="login-hint">Don't have an account? <a href="#" onClick={toggleLogin}>Register!</a></div>
            :
            <div styleName="login-hint">Already have an account? <a href="#" onClick={toggleLogin}>Log in!</a></div>
          }

        </form>
      </div>

      <Footer />
    </div>
  );
}

export default CSSModules(Login, styles);