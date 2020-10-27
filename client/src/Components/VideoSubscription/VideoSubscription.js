import React, { useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import styles from "./video-subscription.module.css";
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import Loading from '../Loading/Loading';
import Login from '../Login/Login';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { decodeAccessToken } from '../../util';
const stripePromise = loadStripe("pk_test_51HbBbtDSAAIAD42iCwQiCcQe2cIwQTl18WtiG7D33sNOSFrRAFZlnWjLFtdCYMnEsfoFTHTEgXabi0mDjiWKpCcp00Ez2X583i");

const VideoSubscription = ({streamKey, name, onSuccess}) => {
  const [selection, setSelection] = useState();
  const [user, setUser] = useState(decodeAccessToken());
  const [loading, setLoading] = useState(true);

  const dayPass = (
    <div styleName="video-subscription">
      <div styleName="blurb">
        Buy a day pass for just &euro;5 to watch {name}'s stream.
      </div>
      
      <div styleName="checkout-holder">
        <Elements stripe={stripePromise}>
          <CheckoutForm streamKey={streamKey} onSuccess={onSuccess}/>
        </Elements>
      </div>
    </div>
  );

  const monthly = (
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

  const yearly = (
    <div styleName="video-subscription">
      <div styleName="blurb">
        Subscribe for just &euro;30 per year to watch {name}'s stream. Cancel any time.
      </div>
      
      <div styleName="checkout-holder">
        <Elements stripe={stripePromise}>
          <CheckoutForm streamKey={streamKey} onSuccess={onSuccess}/>
        </Elements>
      </div>
    </div>
  );

  useEffect(() => {
    const getPrices = async () => {
      axios.get(() => {
        // TODOOOOOOOOOOOOOOOOOOOOOOO
      });
      setLoading(false);
    }
    getPrices();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div>
        <Login returnURL={document.location.href} />
      </div>
    );
  }

  let content;
  if (selection === "dayPass") {
    content = dayPass;
  } else if (selection === "monthly") {
    content = monthly;
  } else if (selection === "yearly") {
    content = yearly;
  } else {
    return (
      <div>
        Subscribe to {name} to watch live content. Please select a plan below:

        <div styleName="payment-option" onClick={() => setSelection("dayPass")}>Day Pass <span styleName="price"> - &euro;1</span></div>
        <div styleName="payment-option" onClick={() => setSelection("monthly")}>Monthly <span styleName="price"> - &euro;10 monthly</span></div>
        <div styleName="payment-option" onClick={() => setSelection("yearly")}>Yearly <span styleName="price"> - &euro;100 annually</span></div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setSelection()}>Back</button>
      {content}
    </div>
  );
};

export default CSSModules(VideoSubscription, styles, {allowMultiple: true,});
