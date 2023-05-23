// @ts-check

// https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/

// Log the extension name
// @ts-ignore
const manifest = chrome.runtime.getManifest();
console.log(`<< Extension Name:  ${manifest.name} >>`);

const defaultState = getCSSColorVariables();

// Listen for messages from the popup
// @ts-ignore
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { action } = request;

  if (action === 'get-variables') {
    // Retrieve the CSS variables from the DOM and send them in the response
    const variables = getCSSColorVariables();
    console.log(`<< cssCustomVariables >>`, variables);

    sendResponse({ variables });
  } else if (action === 'update-variable') {
    // Update the value of the CSS variable in the DOM
    updateVariable(request.name, request.value);
  } else if (action === 'reset-variables') {
    for (let [name, value] of defaultState) {
      updateVariable(name, value);
    }
  }
});
