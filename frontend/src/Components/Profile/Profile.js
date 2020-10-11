import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import jwt from 'jwt-decode'
import Header from '../Header/Header';
import CSSModules from 'react-css-modules';
import styles from './profile.module.css';

const Profile = () => {
  const history = useHistory();
  
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    history.push("/login");
  }

  let user;
  try {
    user = jwt(accessToken);
  } catch (e) {
    history.push("/login");
  }

  useEffect(() => {
    axios.get('/users/subscriptions').then(() => {
      console.log("Success!");
    }).catch(() => {
      //
    });
  }, []);

  return (
    <div styleName="profile">
      <Header user={user}/>

        <div styleName="profile-content">
          <h3>
            Your subscriptions
          </h3>
          
          <div styleName="list">
            <Link to="/c/dstream">DStream</Link>
          </div>
          
          <h3>
            All streams
          </h3>

          <div styleName="list">
            <Link to="/c/dstream">Lansdowne F.C.</Link>
            <Link to="/c/dstream">DStream</Link>
            <Link to="/c/dstream">Kitti's Hatha Yoga</Link>
          </div>
        </div>
    </div>
  )
}

export default CSSModules(Profile, styles);