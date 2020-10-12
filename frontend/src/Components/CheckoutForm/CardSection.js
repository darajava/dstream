/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import './CardSectionStyles.css'
import styles from './checkout-form.module.css';
import CSSModules from 'react-css-modules';
import { Lock } from 'react-feather';

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Work Sans", sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection({stripe}) {
  return (
    <div styleName="card-details">
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <div styleName="creds-holder">
        <img src="./images/stripe.png" styleName="stripe" title="Securely processed with Stripe" />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="green"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>

        <button styleName="button" disabled={!stripe}>Subscribe</button>
      </div>
    </div>
  );
};

export default CSSModules(CardSection, styles);
