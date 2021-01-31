import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Login from './login';

export interface RoomProps extends RouteComponentProps {
	userType: string;
}

export interface RoomState {
	loggedIn: boolean;
	userType: string;
	displayName: string;
	roomID: string;
}

class Room extends React.Component<RoomProps, RoomState> {
	state = {
		loggedIn: false,
		userType: '',
		displayName: '',
		roomID: ''
	};

	componentDidMount() {
		this.setState({ userType: this.props.userType });
	}

	handleLogin = (displayName, roomID) => {
		console.log(displayName, roomID);
		this.setState({
			displayName,
			roomID,
			loggedIn: true
		});
	};

	render() {
		const { userType } = this.state;
		return (
			<div>
				{!this.state.loggedIn && (
					<Login userType={userType} handleLogin={this.handleLogin} />
				)}
				{this.state.loggedIn && <div>Room</div>}
			</div>
		);
	}
}

export default Room;
