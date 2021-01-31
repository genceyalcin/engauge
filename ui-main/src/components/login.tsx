import React from 'react';
import * as https from 'https';

export interface LoginProps {
	userType: string;
	handleLogin: Function;
}

export interface LoginState {
	userType: string;
	displayName: string;
	roomID: string;
	roomName: string;
}

class Login extends React.Component<LoginProps, LoginState> {
	
	public static readonly DOMAIN = 'engauge-api-room-rqh2uw2ppq-uk.a.run.app';
	
	state = {
		userType: '',
		displayName: '',
		roomID: '',
		roomName: ''
	};

	componentDidMount(): void {
		this.setState({ userType: this.props.userType });
	}

	handleSubmit = async () => {
		let { displayName, roomID, roomName } = this.state;
		const { userType } = this.props;

		// submit to api
		if (userType === 'student') {
			// join room
			roomName = 'Test Room';
		} else if (userType === 'teacher') {
			const data = JSON.stringify({
				host_username: displayName,
				room_name: roomName 
			})

			const options = {
				hostname: Login.DOMAIN,
				path: `/room`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': data.length
				}
			}

			let roomPromise = new Promise<string>(function(resolve, reject) {
				let req = https.request(options, (res) => {
					console.log('Inside');
					if (res.statusCode !== 200) return reject("Ooops!");
					console.log('200');

					let body: string = "";
					
					res.on('data', function(d) {
						body += d;
					})

					res.on('end', function() {
						return resolve(body);
					})
				})
				
				req.write(data);
				req.end();
			})

			await roomPromise.then(body => roomID = body || "");
		}

		// send info back to room component
		this.props.handleLogin(displayName, roomID, roomName);
	};

	handleNameChange = (e) => {
		this.setState({ displayName: e.target.value });
	};

	handleIDChange = (e) => {
		this.setState({ roomID: e.target.value });
	};

	handleRoomNameChange = (e) => {
		this.setState({ roomName: e.target.value });
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
					{this.props.userType === 'student' && (
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
					)}
					{this.props.userType === 'teacher' && (
						<div className="form-group">
							<label htmlFor="roomName">Room Name</label>
							<input
								type="text"
								name="roomName"
								id="roomName"
								className="form-control"
								placeholder="Room Name"
								aria-describedby="roomNameHelp"
								value={this.state.roomName}
								onChange={this.handleRoomNameChange}
							/>
							<small id="roomNameHelp" className="text-muted">
								Enter a name for the room you're creating
							</small>
						</div>
					)}
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
