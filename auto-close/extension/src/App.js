/*global chrome*/

import './App.css';
import TimeLimit from './TimeLimit';
import React, { Component } from 'react'

class App extends Component {

  handleCloseTabs = async () => {
    let [current] = await chrome.tabs.query({
      active: true, 
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: current.id },
      function: this.sendSignal,
    })
  };

  sendSignal = () => {
    chrome.runtime.sendMessage({message: "close-tabs"});
  }

  render() {
    return (
      <div>
        <div className="App">
      <header className="App-header">
        Welcome!
      </header>
      <div>
        <button id="closeTabsBtn" onClick={this.handleCloseTabs}>Close tabs</button>
        <br />
        <TimeLimit />
      </div>
      
    </div>
      </div>
    )
  }
}

export default App;

