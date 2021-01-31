import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Login from './login';
import Peer from 'peerjs'

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
	remoteStream: MediaStream;
	microphoneOn: boolean;
	peer: any;
	call: any;
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
		myVideoStream: new MediaStream(),
		remoteStream: new MediaStream(),
		peer: undefined,
		call: undefined
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
		await this.handleGetVideo();
		await this.handleGetAudio();
		if (this.state.userType === 'teacher') {
			await this.handlePeerJSTeacher();
		}
		else {
			await this.handlePeerJSStudent();
		}
	};

	handlePeerJSStudent = async () => {
		console.log('Handling student');
		let peer = new Peer(`${this.state.displayName}@${this.state.roomID}`);
		
		let mixedStream = new MediaStream();
		mixedStream.addTrack(this.state.myAudioStream.getTracks()[0]);
		mixedStream.addTrack(this.state.myVideoStream.getTracks()[0]);
		
		console.log('Calling teacher');
		let call = peer.call(this.state.roomID, this.state.myVideoStream);
		call.on('stream', (remoteStream: MediaStream) => {
			this.setState({
				remoteStream
			})
			let video: any = document.getElementById('instructorVideo');
			video.srcObject = this.state.remoteStream;
		})

		this.setState({peer, call});
	}

	handlePeerJSTeacher = async () => {
		console.log('Handling teacher');
		let peer = new Peer(this.state.roomID);
		peer.on('call', (call) => {
			let mixedStream = new MediaStream();
			mixedStream.addTrack(this.state.myAudioStream.getTracks()[0]);
			mixedStream.addTrack(this.state.myVideoStream.getTracks()[0]);

			console.log('Answering!');
			call.answer(this.state.myVideoStream);
			call.on('stream', (remoteStream: MediaStream) => {
				this.setState({
					remoteStream
				})
				let video: any = document.getElementById('studentVideo');
				video.srcObject = this.state.remoteStream;
			})

			this.setState({peer, call})
		})
	}	

	handleGetVideo = async () => {
		let stream = await navigator.mediaDevices.getUserMedia(
			{
				video: true,
				audio: false
			});
		this.onGetVideoSuccess(stream);
	};
	onGetVideoSuccess = (stream: MediaStream) => {
		this.setState({
			myVideoStream: stream
		});
		let video: any = document.getElementById('userVideo');
		video.srcObject = this.state.myVideoStream;
	};

	handleGetAudio = async () => {
		let stream = await navigator.mediaDevices.getUserMedia(
			{
				video: false,
				audio: true
			});
		this.onGetAudioSuccess(stream);
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

	gaugeReactions = () => {
		console.log('GAUGING...');
	};

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
								className="col-12"
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
												? 'btn btn-success col-12'
												: 'btn btn-danger col-12'
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
											id="instructorVideo"
										></video>
									</div>
								)}
								{this.state.userType === 'teacher' && (
									<div className="student-vid col-12">
										<video
											autoPlay={true}
											className="col-12 video-box"
											id="studentVideo"
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
