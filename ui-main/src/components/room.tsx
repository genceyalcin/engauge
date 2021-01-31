import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Login from './login';
import * as https from 'https'
import Peer from 'peerjs';
import FaceData from './faceData';

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
	conn: any;
	displayData: boolean;
	gaugeData: {
		students: [
			{
				name: string;
				reactions: {
					joy: string;
					surprise: string;
					sorrow: string;
					anger: string;
				};
			}
		];
	} | null;
}

class Room extends React.Component<RoomProps, RoomState> {
	public static readonly DOMAIN = 'engauge-api-room-rqh2uw2ppq-uk.a.run.app';
	public static readonly PEER_HOST = 'emerald-rhythm-303318.uk.r.appspot.com';
	public static readonly PEER_PATH = '/myapp';
	public static readonly KEY = 'peerjs';
	public static readonly OPTIONS = {key: Room.KEY, secure:true, port: 443, debug: 3, path: Room.PEER_PATH, host: Room.PEER_HOST};

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
		call: undefined,
		conn: undefined
		displayData: false,
		gaugeData: null
	};

	componentDidMount() {
		this.setState({ userType: this.props.match.params.userType });
	}

	handleLogin = async (
		displayName,
		roomID,
		roomName,
		hostIP,
		hostUsername
	) => {
		this.setState({
			displayName,
			roomID,
			roomName,
			loggedIn: true,
			hostUserIp: hostIP || '',
			hostUsername
		});
		await this.handleGetVideo();
		await this.handleGetAudio();
		if (this.state.userType === 'teacher') {
			await this.handlePeerJSTeacher();
		} else {
			await this.handlePeerJSStudent();
		}
	};

	handlePeerJSStudent = async () => {
		console.log('Handling student');
		let peer = new Peer(`0@${this.state.roomID}`, Room.OPTIONS);
		
		let mixedStream = new MediaStream();
		mixedStream.addTrack(this.state.myAudioStream.getTracks()[0]);
		mixedStream.addTrack(this.state.myVideoStream.getTracks()[0]);

		console.log('Calling teacher');
		let call = peer.call(this.state.roomID, this.state.myVideoStream);
		call.on('stream', (remoteStream: MediaStream) => {
			this.setState({
				remoteStream
			});
			let video: any = document.getElementById('instructorVideo');
			video.srcObject = this.state.remoteStream;
		});

		// let conn = peer.connect(this.state.roomID);
		// conn.on('open', () => {
		// 	conn.on('data', (data) => {


		// 		conn.send('request');
		// 	})
		// })

		this.setState({peer, call});
	}

	handlePeerJSTeacher = async () => {
		console.log('Handling teacher');
		let peer = new Peer(this.state.roomID, Room.OPTIONS);
		peer.on('call', (call) => {
			let mixedStream = new MediaStream();
			mixedStream.addTrack(this.state.myAudioStream.getTracks()[0]);
			mixedStream.addTrack(this.state.myVideoStream.getTracks()[0]);

			console.log('Answering!');
			call.answer(this.state.myVideoStream);
			call.on('stream', (remoteStream: MediaStream) => {
				this.setState({
					remoteStream
				});
				let video: any = document.getElementById('studentVideo');
				video.srcObject = this.state.remoteStream;
			});

			this.setState({call})
		})

		let conn = peer.connect('0@'+this.state.roomID);
		this.setState({peer, conn});
	}	

	handleGetVideo = async () => {
		let stream = await navigator.mediaDevices.getUserMedia({
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
		let stream = await navigator.mediaDevices.getUserMedia({
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

	gaugeReactions = async () => {
		// if (this.state.conn) {
		// 	let conn: any = this.state.conn;
		// 	const options = {
		// 		hostname: Room.DOMAIN,
		// 		path: '/gauge?room_id='+this.state.roomID,
		// 		method: 'POST'
		// 	}

		// 	let gaugePromise = new Promise<object>(function (resolve, reject) {
		// 		let req = https.request(options, (res) => {
		// 			if (res.statusCode !== 200) return reject("Ooops!");

		// 			let body: string = "";
					
		// 			res.on('data', function(d) {
		// 				body += d;
		// 			})

		// 			res.on('end', function() {
		// 				return resolve(JSON.parse(body));
		// 			})
		// 		})
		// 		req.end();
		// 	})

		// 	let gaugeTime = "";
		// 	await gaugePromise.then(body => gaugeTime = body['gauge_time']);

		// 	conn.on('open', () => {
		// 		conn.send(gaugeTime);
		// 	})
		// }
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
									<span>
										{'Room ID: ' + this.state.roomID}
									</span>
								</div>
							</div>
							{/* {this.state.displayData && (
								<div className="col-12">
									<FaceData
										gaugeData={this.state.gaugeData}
									/>
								</div>
							)} */}
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default Room;
