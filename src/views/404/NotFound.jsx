import React from "react";
import OlympusLogo from '../../assets/logo.svg';

export default function NotFound() {
	return (
		<div>
			<div className="not-found-header">
				<a href="https://olympusdao.finance" target="_blank">
					<img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
				</a>

				<h4>Page not found</h4>
			</div>
		</div>
	)
}