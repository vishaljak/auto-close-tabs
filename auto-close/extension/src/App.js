/*global chrome*/

import "./App.css";
import TimeLimit from "./TimeLimit";
import React, { Component } from "react";

class App extends Component {
	handleCloseTabs = async () => {
		let [current] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});

		chrome.scripting.executeScript({
			// FIXME: this gives an error when clicked on chrome:// tabs, since they cannot be modified for security reasons
			target: { tabId: current.id },
			function: this.sendSignal,
		});
	};

	sendSignal = () => {
		chrome.runtime.sendMessage({ message: "close-tabs" });
	};

	render() {
		return (
			<div>
				<div className="App">
					<div className="App-header">Welcome!</div>
					<div>
						<TimeLimit />
						<br />
						<button
							id="closeTabsBtn"
							onClick={this.handleCloseTabs}
						>
							Close tabs
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
