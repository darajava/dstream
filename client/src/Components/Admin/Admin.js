import React, { useState, useEffect } from "react";
import CSSModules from "react-css-modules";
import styles from "./Admin.module.css";
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { decodeAccessToken } from '../../util';
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

const Admin = () => {
  const history = useHistory();
  const [customerInfo, setCustomerInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState(true);
  const [online, setOnline] = useState();
  const user = decodeAccessToken();

  const updatePrice = (e, period) => {
    axios.put("users/customer-info", {
      key: period + "_price",
      value: e.target.value,
      channel: user.admin
    }).catch(e => {
      alert("Error: could not update price");
    })
  }

  const toggleOnline = (e, period) => {
    if (typeof online === "undefined") return;

    axios.put("users/customer-info", {
      key: "live_now",
      value: !online ? "1" : "0",
      channel: user.admin
    }).then(() => {
      setOnline(!online)
    }).catch(e => {
      alert("Error: could not change online");
    });
  }

  useEffect(() => {
    const doIt = async () => {
      try {
        const res = await axios.get("users/customer-info", {
          params: {
            channel: user.admin,
          }
        });

        const priceRes = await axios.get("users/prices");

        setCustomerInfo(res.data);
        setLoading(false);
        setPrices(priceRes.data);
        setOnline(!!res.data.live_now);
      } catch (e) {
        console.log(e);
        alert("Something went wrong.");
      }
    }
    doIt();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const priceOptions = {
    yearly: [<option/>],
    monthly: [<option/>],
    once: [<option/>]
  };
  if (prices) {
    console.log(customerInfo);
    for (let i = 0; i < prices.length; i++) {
      if (prices[i].period === "yearly") {
        priceOptions["yearly"].push(
          <option value={prices[i].id} selected={customerInfo.yearly_price === prices[i].id}>
            &euro;{prices[i].value}
          </option>
        );
      } else if (prices[i].period === "monthly") {
        priceOptions["monthly"].push(
          <option value={prices[i].id} selected={customerInfo.monthly_price === prices[i].id}>
            &euro;{prices[i].value}
          </option>
        );
      } else if (prices[i].period === "once") {
        priceOptions["once"].push(
          <option value={prices[i].id} selected={customerInfo.day_pass_price === prices[i].id}>
            &euro;{prices[i].value}
          </option>
        ); 
      }

    }
  }

  console.log(prices);

  return (
    <div>
      <Header />
        <div styleName="container">
          <div styleName="page-header">{user.admin}'s Settings</div>
          <div styleName="section">
            <div styleName="header">
              Pricing
            </div>
            <div styleName="sub-header">
              This is how much you want to charge monthly for your streaming service:
            </div>

            <div styleName="option">
              Yearly price: 
              <select onChange={e => updatePrice(e, "yearly")}>
                {priceOptions.yearly}
              </select>
            </div>
            <div styleName="option">
              Monthly price: 
              <select onChange={e => updatePrice(e, "monthly")}>
                {priceOptions.monthly}
              </select>
            </div>
            <div styleName="option">
              Day pass price: 
              <select onChange={e => updatePrice(e, "day_pass")}>
                {priceOptions.once}
              </select>
            </div>
          </div>

          <div styleName="section">
            <div styleName="header">
              Live Now
            </div>
            <div styleName="sub-header">
              Make sure to press this button when you are going live/off air
            </div>

            <button onClick={toggleOnline}>{online ? "🔴 Live" : "Off Air"}</button>
          </div>

          <div styleName="section">
            <div styleName="header">
              Your Channel
            </div>
            <div styleName="sub-header">
              Take a look at your channel here
            </div>

            <button onClick={() => {history.push('/c/' + user.admin)}}>Click here</button>
          </div>
        </div>
      <Footer />
    </div>
  );
};

export default CSSModules(Admin, styles, {allowMultiple: true,});
