// create new tab and open it
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "index.html" });
});
