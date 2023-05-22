// @ts-check

// https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/

// Log the extension name
// @ts-ignore
const manifest = chrome.runtime.getManifest();
console.log(`<< Extension Name:  ${manifest.name} >>`);

const variables = getComputedStyle(document.documentElement);
const cssCustomVariables = Array.from(
  // @ts-ignore
  document.documentElement.computedStyleMap()
  // getCSSCustomPropIndex()
)
  .filter(
    ([name, value], i) =>
      String(name).startsWith('--') && CSS.supports(`color: ${value}`)
  )
  .map(([name, value]) => [name, value[0][0]]);

console.log(`<< cssCustomVariables >>`, cssCustomVariables);
// console.log(`<< getCSSCustomPropIndex() >>`, getCSSCustomPropIndex());

// Listen for messages from the popup
// @ts-ignore
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getVariables') {
    // Retrieve the CSS variables from the DOM and send them in the response
    sendResponse({ variables: cssCustomVariables });
  } else if (request.action === 'updateVariable') {
    debugger;
    // Update the value of the CSS variable in the DOM
    document.documentElement.style.setProperty(request.name, request.value);
  }
});
