import * as React from 'react';

export interface FaceDataProps {
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

export interface FaceDataState {}

class FaceData extends React.Component<FaceDataProps, FaceDataState> {
	render() {
		return (
			<div className="col-4">
				<h2>Face Data</h2>
				<h6>{this.props.gaugeData?.students[0].name}</h6>
				<p>
					Joy: {this.props.gaugeData?.students[0].reactions.joy}{' '}
					<br />
					Surprise:{' '}
					{this.props.gaugeData?.students[0].reactions.surprise}{' '}
					<br />
					Sorrow: {
						this.props.gaugeData?.students[0].reactions.sorrow
					}{' '}
					<br />
					Anger: {
						this.props.gaugeData?.students[0].reactions.anger
					}{' '}
					<br />
				</p>
			</div>
		);
	}
}

export default FaceData;
