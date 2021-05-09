let testTabs = document.getElementById("buttonDiv");

testTabs.addEventListener("click", async () => {
	// await makes the code wait for this expression to complete
	let [current] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});

	chrome.scripting.executeScript({
		target: { tabId: current.id },
		function: whonde,
	});
});

function whonde() {
	
	chrome.runtime.sendMessage({message: "close-tabs"});
	
}
