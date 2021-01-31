import React from 'react';
import About from './about';
import { Link } from 'react-router-dom';

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
	render() {
		return (
			<React.Fragment>
				<div className="px-3 role-prompt">
					<h1>What is your role?</h1>
					<p className="lead">
						Please select a role to login to a lecture with.
					</p>
					<div className="container">
						<Link to="/room/student">
							<button className="btn btn-primary mr-3">
								Student
							</button>
						</Link>
						<Link to="/room/teacher">
							<button className="btn btn-primary ml-3">
								Teacher
							</button>
						</Link>
					</div>
				</div>
				<About />
			</React.Fragment>
		);
	}
}

export default Home;
