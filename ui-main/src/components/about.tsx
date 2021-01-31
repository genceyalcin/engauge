import React from 'react';

export interface AboutProps {}

const About: React.FunctionComponent<AboutProps> = () => {
	return (
		<div>
			<h3>What is EnGauge?</h3>
			<p>
				EnGauge is a virtual lecture platform that allows professors to
				measure class engagement using machine learning. By using Google
				Cloud's Vision AI, we are able to gauge the reaction of each
				student based on their facial expressions. Students are able to
				join different lectures based on a room ID. In these rooms,
				professors can press a 'Gauge Reactions' button to receive a
				snapshot of student engagement.
			</p>
			<h4>The Stack</h4>
			{/* TODO: FINISH THIS DESCRIPTION */}
			<p>
				For this project, we decided to go serverless using Google
				Cloud's suite of tools. For the back-end, we created a REST API
				using Flask. The data for this system is stored on Firestore DB.
			</p>
			<p>
				For our front-end, we used ReactJS in combination with NodeJS
				for scripting, and Bootstrap for formatting. This is then
				statically hosted in Google Cloud Storage.
			</p>
		</div>
	);
};

export default About;
