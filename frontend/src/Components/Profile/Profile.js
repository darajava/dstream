import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import Header from '../Header/Header';
import CSSModules from 'react-css-modules';
import styles from './profile.module.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';

const stripePromise = loadStripe("pk_test_51HbBbtDSAAIAD42iCwQiCcQe2cIwQTl18WtiG7D33sNOSFrRAFZlnWjLFtdCYMnEsfoFTHTEgXabi0mDjiWKpCcp00Ez2X583i");

const Profile = () => {
  const history = useHistory();
  
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
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
      <Header />

        <div styleName="checkout-holder">
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>

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