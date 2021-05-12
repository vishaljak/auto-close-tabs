const TIME_LIMIT = 1000000;

let tabRecords = [];

chrome.tabs.onActivated.addListener((tab) => {
	let found = false;
	let index = -100;
	chrome.tabs.query({active: true}, (tab) => {
		console.log(tab)
		for (let i=0; i<tabRecords.length; i++) {
			if (tabRecords[i].tabId == tab[0].id) {
				found = true;
				index = i;
				tabRecords[i].timeOpened = new Date().getTime();
				break;
			}
		}

		if (!found) {
			tabRecords.push({tabId: tab[0].id, timeOpened: new Date().getTime()});
			setInterval(() => {
				tabRecords[tabRecords.length-1].timeOpened += 1000;
			}, 1000);
		} else if (found) {
			setInterval(() => {
				tabRecords[index].timeOpened += 1000;
			}, 1000);
		}

		console.log(tabRecords);
	})
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if (request.message == "close-tabs") {
		closeTabRecord = [];

		for (let i = 0; i < tabRecords.length; i++) {
			if ((new Date().getTime() - tabRecords[i].timeOpened) > timeLimit) {
				closeTabRecord.push(tabRecords[i].tabId);
			}
		}

		for (let i = 0; i < closeTabRecord.length; i++) {
			chrome.tabs.remove(closeTabRecord[i], () => {
				console.log(`${closeTabRecord[i]} closed`);
			});
		}

		chrome.tabs.query({}, (tabs) => {

			for (let i=0; i<tabs.length; i++) {
				console.log(tabs[i]);

			}

		})

		sendResponse({farewell: "goodbye"});
	}
});
