import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import Home from './components/home';
import './App.css';
import Room from './components/room';
import Header from './components/header';

function App() {
	return (
		<React.Fragment>
			<Router>
				<Header />
				<main className="container-fluid">
					<Switch>
						<Route path="/home" component={Home} />
						{/* <Route path="/login/:userType" component={Login}/> */}
						<Route path="/room/:userType" component={Room} />
						<Redirect from="/*" to="/home" />
					</Switch>
				</main>
			</Router>
		</React.Fragment>
	);
}

export default App;
