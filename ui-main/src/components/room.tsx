import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Login from './login';

export interface RoomProps extends RouteComponentProps {
	match: {
		isExact: true;
		params: {
			userType: string;
		};
		path: string;
		url: string;
	};
}

export interface RoomState {
	hostUsername: string;
	roomName: string;
	hostUserIp: string;
	loggedIn: boolean;
	userType: string;
	displayName: string;
	roomID: string;
	myAudioStream: MediaStream;
	myVideoStream: MediaStream;
	microphoneOn: boolean;
}

class Room extends React.Component<RoomProps, RoomState> {
	
	public static readonly DOMAIN = 'engauge-api-room-rqh2uw2ppq-uk.a.run.app';
	
	state = {
		hostUsername: '',
		roomName: '',
		hostUserIp: '',
		loggedIn: false,
		userType: '',
		displayName: '',
		roomID: '',
		microphoneOn: false,
		myAudioStream: new MediaStream(),
		myVideoStream: new MediaStream()
	};

	componentDidMount() {
		this.setState({ userType: this.props.match.params.userType });
	}

	handleLogin = async (displayName, roomID, roomName, hostIP, hostUsername) => {
		this.setState({
			displayName,
			roomID,
			roomName,
			loggedIn: true,
			hostUserIp: hostIP || "",
			hostUsername
		});
		console.log(this.state.hostUserIp);
		this.handleGetVideo();
		this.handleGetAudio();
	};

	handleGetVideo = () => {
		navigator.getUserMedia(
			{
				video: true,
				audio: false
			},
			this.onGetVideoSuccess,
			this.onGetVideoFail
		);
	};
	onGetVideoSuccess = (stream: MediaStream) => {
		this.setState({
			myVideoStream: stream
		});
		let video: any = document.getElementById('userVideo');
		video.srcObject = this.state.myVideoStream;
	};
	onGetVideoFail = (error: MediaStreamError) => {
		console.log(error);
	};

	handleGetAudio = () => {
		navigator.getUserMedia(
			{
				video: false,
				audio: true
			},
			this.onGetAudioSuccess,
			this.onGetAudioFail
		);
	};

	onGetAudioSuccess = (stream: MediaStream) => {
		this.setState({
			microphoneOn: true,
			myAudioStream: stream
		});
	};

	onToggleMicrophone = () => {
		if (this.state.microphoneOn) {
			this.state.myAudioStream
				.getTracks()
				.forEach((track) => track.stop());
			this.setState({
				microphoneOn: false
			});
		} else {
			this.handleGetAudio();
		}
	};

	onGetAudioFail = (error: MediaStreamError) => {
		console.log(error);
	};

	gaugeReactions = () => {
		console.log('GAUGING...');
	};


	RTCConnection = () => {
		let configuration = { iceServers: [{
			urls: [
				"stun.l.google.com:19302",
				"stun1.l.google.com:19302",
				"stun2.l.google.com:19302",
				"stun3.l.google.com:19302",
				"stun4.l.google.com:19302",
				"stun.stunprotocol.org"
			]
		}]};
		let pc = new RTCPeerConnection(configuration);
		//pc.addTrack()
	}

	render() {
		const { userType } = this.state;
		return (
			<div>
				{!this.state.loggedIn && (
					<Login userType={userType} handleLogin={this.handleLogin} />
				)}
				{this.state.loggedIn && (
					<div className="container">
						<div className="row">
							<div
								className="col-4"
								style={{
									backgroundColor: 'gray',
									paddingTop: '25px'
								}}
							>
								<div className="col-12">
									<h1>{this.state.roomName} </h1>
								</div>
								<div
									className="user-vid col-12"
									style={{ marginBottom: '25px' }}
								>
									<h3>{this.state.displayName}</h3>
									<video
										autoPlay={true}
										className="col-12 video-box"
										id="userVideo"
									></video>
									<button
										className={
											this.state.microphoneOn
												? 'btn btn-danger col-12'
												: 'btn btn-success col-12'
										}
										onClick={this.onToggleMicrophone}
									>
										{this.state.microphoneOn
											? 'Mute'
											: 'Unmute'}
									</button>
									{this.state.userType === 'teacher' && (
										<button
											className="btn btn-primary col-12"
											onClick={this.gaugeReactions}
										>
											Gauge Reactions
										</button>
									)}
								</div>
								{this.state.userType === 'student' && (
									<div className="instructor-vid col-12">
										<h3>{this.state.hostUsername}</h3>
										<video
											autoPlay={true}
											className="col-12 video-box"
										></video>
									</div>
								)}
								<div className="col-12">
									<span>{"Room ID: " + this.state.roomID}</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default Room;
