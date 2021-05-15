/*global chrome*/
import React, { Component } from "react";

class TimeLimit extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             time_limit: 5
        };
    }
    
    // update state and send new time limit to background.js
    handleTimeChange = (e) => {
        this.setState({
            time_limit: e.target.value
        })

        chrome.runtime.sendMessage({
            message: "new-time-limit",
            time_limit: e.target.value
        });
    }

	render() {
		return (
			<div>
				<label for="time">Choose time limit:</label><br/>
				<select name="time" id="timeSelector" onChange={this.handleTimeChange}>
					<option value="5">5 mins</option>
					<option value="15">15 mins</option>
					<option value="30">30 mins</option>
					<option value="60">1 hour</option>
					<option value="120">2 hours</option>
					<option value=""> Custom </option>
				</select>
			</div>
		);
	}
}

export default TimeLimit;
