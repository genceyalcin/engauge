import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './components/home';
import './App.css';
import Login from './components/login';

function App() {
  return (
    <React.Fragment>
      <Router>
        <main className="container">
          <Switch>
            <Route path="/home" component={Home}/>
            <Route path="/login/:userType" component={Login}/>
            <Redirect from="/" to="/home"/>
          </Switch>
        </main>
      </Router>
    </React.Fragment>
  );
}

export default App;
