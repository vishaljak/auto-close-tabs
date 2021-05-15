/*global chrome*/

let TIME_LIMIT = 300000;

let tabRecords = [];

// update the time limit
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == "new-time-limit") {
		TIME_LIMIT = request.time_limit * 60000;
	}
});

chrome.tabs.onActivated.addListener((tab) => {
	let f = false;
	let index = -100;
	
	// stores each tab in the array to keep track of the opened tabs
	chrome.tabs.query({active: true, currentWindow: true}, (tab) => {
		console.log(tab)
		for (let i=0; i<tabRecords.length; i++) {
			if (tabRecords[i].tabId == tab[0].id) {
				f = true;
				index = i;
				tabRecords[i].timeOpened = new Date().getTime();
				break;
			}
		}
		
		// update tab info if tab not there in the array
		if (!f) {
			tabRecords.push({tabId: tab[0].id, timeOpened: new Date().getTime()});
			setInterval(() => {
				tabRecords[tabRecords.length-1].timeOpened += 1000;
			}, 1000);
		} else if (f) { // update tab info if tab already there in the array
			setInterval(() => {
				tabRecords[index].timeOpened += 1000;
			}, 1000);
		}

		console.log(tabRecords);
	})
});

// listen for message from button click
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.message == "close-tabs") {
		let closeTabRecord = [];
		
		// check which tabs have been unopened for the time limit
		for (let i = 0; i < tabRecords.length; i++) {
			if ((new Date().getTime() - tabRecords[i].timeOpened) > TIME_LIMIT) {
				closeTabRecord.push(tabRecords[i].tabId);
			}
		}

		// close the unopened tabs
		for (let i = 0; i < closeTabRecord.length; i++) {
			chrome.tabs.remove(closeTabRecord[i], () => {
				console.log(`${closeTabRecord[i]} closed`);
			});
		}

		sendResponse({farewell: "closed-tabs"});
	}
});

