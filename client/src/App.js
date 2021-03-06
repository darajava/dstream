import React from 'react';
import Home from './Components/Home/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import CustomerPage from './Components/CustomerPage/CustomerPage';
import Login from './Components/Login/Login';
import Admin from './Components/Admin/Admin';
import Profile from './Components/Profile/Profile';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import CSSModules from 'react-css-modules';
import styles from './App.module.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Request interceptor for API calls
axios.interceptors.request.use(
  async config => {
    config.headers = { 
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Accept": "application/json",
    };
    return config;
  },
  error => {
    Promise.reject(error);
  });

// Allow automatic updating of access token
axios.interceptors.response.use(response => response, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && localStorage.getItem("refreshToken") && !originalRequest._retry) {
    originalRequest._retry = true;
    const res = await axios.post("/users/token", { token: localStorage.getItem("refreshToken") });
    localStorage.setItem("accessToken", res.data.accessToken);

    return axios.request(originalRequest);
  }
  return Promise.reject(error);
});
      

function App() {
  return (
    <div>
      <Router basename="app">
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/c/:stream_key">
          <CustomerPage />
        </Route>
        <Route path="/login">
          <div styleName="login-holder">
            <Header />
            <Login />
            <Footer />
          </div>
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
      </Router>
    </div>
  );
}

export default CSSModules(App, styles);
