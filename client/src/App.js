import React, { useState } from 'react';
import Login from './components/Login'
import About from './components/About'
import Order from './components/Order'
import Storeinfo from './components/Storeinfo'
import Register from './components/register'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Shop from './components/Shop';
import Mycart from './components/Mycart';





function App() {
  const [forRender, setForRender] = useState(0);
  return (
    <div className="App">


      <Router>
        <Switch>
          <Route exact path="/login" component={() => <div className="loginPage"><Login /> <About /> <Storeinfo /></div>} />

          <Route path="/register" component={() => <div className="loginPage"><Register /> <About /> <Storeinfo /></div>} />

          <Route path="/shop" component={() => <div className="ShopPage"><Mycart setForRender={setForRender}/> <Shop setForRender={setForRender} /></div>} />
          <Route path="/order" component={() => <div className="ShopPage"><Mycart atOrder={true} /> <Order /></div>} />

          <Redirect to="/login"

          />

        </Switch>

      </Router>
    </div>
  );
}

export default App;
