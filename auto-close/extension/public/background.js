/*global chrome*/

// default value of 30 mins
let time_limit = 1800000;

chrome.storage.sync.get("userLimit", function (result) {
	if (result.userLimit) {
		time_limit = result.userLimit;
	}
});

let tabRecords = [];

// update the time limit
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == "new-time-limit") {
		time_limit = request.time_limit * 60000;
		chrome.storage.sync.set({ userLimit: request.time_limit*60000 }, () => {});

		console.log("time limit is " + time_limit);
	}
});

// adds opened tab to the records and then records its time
chrome.tabs.onActivated.addListener((tab) => {
	setTimeout(() => {
		let f = false;
		let index = -100;

		// stores each tab in the array to keep track of the opened tabs
		chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
			
			for (let i = 0; i < tabRecords.length; i++) {
				if (tabRecords[i].tabId == tab[0].id) {
					f = true;
					index = i;
					tabRecords[i].timeOpened = new Date().getTime();
					break;
				}
			}

			// update tab info if tab not there in the array
			if (!f) {
				tabRecords.push({
					tabId: tab[0].id,
					timeOpened: new Date().getTime(),
				});
				setInterval(() => {
					tabRecords[tabRecords.length - 1].timeOpened += 1000;
				}, 1000);
			} else if (f) {
				// update tab info if tab already there in the array
				setInterval(() => {
					tabRecords[index].timeOpened += 1000;
				}, 1000);
			}
		});
	}, 500);
});

// listen for message from button click
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message == "close-tabs") {
		let closeTabRecord = [];

		time_limit = 18000;

		// check which tabs have been unopened for the time limit
		for (let i = 0; i < tabRecords.length; i++) {
			if (new Date().getTime() - tabRecords[i].timeOpened > time_limit) {
				closeTabRecord.push(tabRecords[i].tabId);
			}
		}

		// close the unopened tabs
		for (let i = 0; i < closeTabRecord.length; i++) {
			chrome.tabs.remove(closeTabRecord[i], () => {
				console.log(`${closeTabRecord[i]} closed`);
			});
		}

		sendResponse({ farewell: "closed-tabs" });
	}
});
