var URL =
  `https://prowand.pro-unlimited.com` + `/worker/standard/standard_home.html`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  alert(`onMessage ${request.action}`);
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: "#3aa757" }, function() {
    console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: URL}
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
