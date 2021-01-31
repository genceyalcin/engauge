import React from 'react';
import { Link } from 'react-router-dom';
import gitLogo from '../GitHub-Mark-Light-32px.png';

export interface HeaderProps {}

const Header: React.FunctionComponent<HeaderProps> = () => {
	return (
		<header className="blog-header py-3 app-header">
			<div className="row flex-nowrap justify-content-between align-items-center">
				<div className="col-4"></div>
				<div className="col-4 text-center">
					<Link to="/home">
						<h3 style={{ color: 'white' }}>EnGauge</h3>
					</Link>
				</div>
				<div className="col-4">
					<a
						href="https://github.com/genceyalcin/engauge"
						target="_blank"
						rel="noreferrer"
					>
						<img src={gitLogo} alt="Git Logo"></img>
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
