import React from 'react';

export interface LoginProps {
	userType: string;
	handleLogin: Function;
}

export interface LoginState {
	userType: string;
	displayName: string;
	roomID: string;
}

class Login extends React.Component<LoginProps, LoginState> {
	state = {
		userType: '',
		displayName: '',
		roomID: ''
	};

	componentDidMount(): void {
		this.setState({ userType: this.props.userType });
	}

	handleSubmit = () => {
		const { userType, displayName, roomID } = this.state;

		// submit to api
		console.log('submitting... ', userType);

		// send info back to room component
		this.props.handleLogin(displayName, roomID);
	};

	handleNameChange = (e) => {
		this.setState({ displayName: e.target.value });
	};

	handleIDChange = (e) => {
		this.setState({ roomID: e.target.value });
	};

	render() {
		return (
			<React.Fragment>
				<h1 style={{ textTransform: 'capitalize' }}>
					{this.props.userType} Login
				</h1>
				<div>
					<div className="form-group">
						<label htmlFor="displayName">Display Name</label>
						<input
							type="text"
							name="displayName"
							id="displayName"
							className="form-control"
							placeholder="Display Name"
							value={this.state.displayName}
							onChange={this.handleNameChange}
						/>
						<small id="nameHelp" className="text-muted">
							This is the name other users will see
						</small>
					</div>
					<div className="form-group">
						<label htmlFor="roomID">Room ID</label>
						<input
							type="text"
							name="roomID"
							id="roomID"
							className="form-control"
							placeholder="Room ID"
							aria-describedby="roomHelp"
							value={this.state.roomID}
							onChange={this.handleIDChange}
						/>
						<small id="roomHelp" className="text-muted">
							Enter the ID of the room you wish to join
						</small>
					</div>
					<button
						className="btn btn-primary"
						onClick={this.handleSubmit}
					>
						{this.props.userType === 'teacher' && 'Create Room'}
						{this.props.userType === 'student' && 'Join Room'}
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default Login;
