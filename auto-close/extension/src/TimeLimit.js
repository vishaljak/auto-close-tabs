// https://stackoverflow.com/questions/48054117/how-to-initialize-state-with-apis-data

/*global chrome*/
import React, { Component } from "react";

class TimeLimit extends Component {

    constructor(props) {
        super(props)

        this.minLimit = 5;
    
        this.state = {
             time_limit: this.minLimit,
        };
    }
    
    // update state and send new time limit to background.js
    handleTimeChange = (e) => {
        this.setState({
            time_limit: e.target.value,
            selectedValue: e.target.value,
        })

        // send new time limit to background
        chrome.runtime.sendMessage({
            message: "new-time-limit",
            time_limit: e.target.value
        });
    }

    // update the input field with existing saved time limit value
    componentDidMount() {
        chrome.storage.sync.get('userLimit', function (docs) {
            if (docs.userLimit) document.getElementById("timeLimitInput").value = Math.floor(docs.userLimit/60000);
        });
    }
    
	render() {
		return (
			<div>
				<label for="time">Enter time limit:</label><br/>
                <input type="number" name="time" min={this.minLimit} max="180" id="timeLimitInput" value={this.state.time_limit} onChange={this.handleTimeChange}/>
			</div>
		);
	}
}

export default TimeLimit;
