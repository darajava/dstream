import React from "react";
import CSSModules from "react-css-modules";
import styles from "./home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link to="/c/dstream">dstream</Link>
      <Link to="/login">login</Link>
      <Link to="/profile">profile</Link>
    </div>
  );
}

export default CSSModules(Home, styles);