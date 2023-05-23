// background.js
console.log("======= background.js ??")

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (
    request.action === 'getVariables' ||
    request.action === 'updateVariable'
  ) {
    const val = getComputedStyle(
      document.querySelector(':root')
    ).getPropertyValue('--white');
    alert(val);

    // Forward the message to the content script
    chrome.tabs.sendMessage(sender.tab.id, request, function (response) {
      sendResponse(response);
    });
    return true; // Required to indicate that the response will be sent asynchronously
  }
});
