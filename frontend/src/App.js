import React from 'react';
import Home from './Components/Home/Home';
import CustomerPage from './Components/CustomerPage/CustomerPage';
import Login from './Components/Login/Login';
import { HashRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/c/:stream_key">
          <CustomerPage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Router>
    </div>
  );
}

export default App;
