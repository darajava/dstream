import React, { useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import styles from "./video-subscription.module.css";
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51HbBbtDSAAIAD42iCwQiCcQe2cIwQTl18WtiG7D33sNOSFrRAFZlnWjLFtdCYMnEsfoFTHTEgXabi0mDjiWKpCcp00Ez2X583i");

const VideoSubscription = ({streamKey, name, onSuccess}) => {

  return (
    <div styleName="video-subscription">
      <div styleName="blurb">
        Subscribe for just &euro;5 per month to watch {name}'s stream. Cancel any time.
      </div>
      
      <div styleName="checkout-holder">
        <Elements stripe={stripePromise}>
          <CheckoutForm streamKey={streamKey} onSuccess={onSuccess}/>
        </Elements>
      </div>
    </div>
  );
};

export default CSSModules(VideoSubscription, styles, {allowMultiple: true,});
