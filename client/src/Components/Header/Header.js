import React, { useState } from "react";
import CSSModules from "react-css-modules";
import styles from "./header.module.css";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import { decodeAccessToken } from '../../util';

const Header = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const logout = () => {  
    axios.delete(
      '/users/logout',
      {
        params: {
          token: localStorage.getItem("refreshToken"),
        }
      }
    ).then(() => {
      setLoading(true);

      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history.push("/login")
      }, 500);
    }).catch(() => {
      history.push("/login");
    });
  }

  let userBlock;
  let user = decodeAccessToken();
  if (user) {
    let adminBlock;
    if (user.admin === "*") {
      adminBlock = (
        <Link to="/admin">
          Superuser
        </Link>
      );
    } else if (user.admin.length) {
      adminBlock = (
        <Link to="/admin">
          {user.admin} Admin Panel
        </Link>
      );
    } else {
      // adminBlock = (
      //   <Link to="/profile">
      //     Profile
      //   </Link>
      // );
    }

    userBlock = (
      <div styleName="user-block">
        <div>
          {user.email}

        </div>
        {adminBlock}
        &nbsp;
        <a href="#" onClick={logout}>Logout</a>
      </div>
    )
  }

  return (
    <div styleName="header">
      {loading && <Loading fullScreen />}
      <img src="/images/dstream.jpeg" />
      {userBlock}
    </div>
  );
};

export default CSSModules(Header, styles);