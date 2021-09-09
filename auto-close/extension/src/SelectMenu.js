/* global chrome */

import React, {Component} from "react";

class SelectMenu extends Component {
    
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div>
                <form> 
                    <label for="timeSelector">Choose time limit:</label> <br/>
                    <select name="timeSelector" value={this.props.selected}>
                        <option value="5">5 mins</option>
                        <option value="15">15 mins</option>
                        <option value="30">30 mins</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hour</option>
                    </select>
                </form>
            </div>
        );
    }
}