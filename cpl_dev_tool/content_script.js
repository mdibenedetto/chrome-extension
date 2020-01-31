 
// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    debugger
    alert('Hey')
});

window.addEventListener('message', (event) => {
    // Only accept messages from same frame
    if (event.source !== window) {
      return;
    }
  
    var message = event.data;
  
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null || !message.hello) {
      return;
    }
  
    chrome.runtime.sendMessage(message);
  });