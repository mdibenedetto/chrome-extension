// @ts-check

console.log(`<< Popup.js >>`);

function attachFilter() {
  // Get the filter input element
  const filterInput = /** @type {HTMLInputElement} */ (
    document.getElementById('txtFilter')
  );

  // Get the input container element
  const inputContainer = /** @type {HTMLElement} */ (
    document.getElementById('variable-list')
  );

  // Add an event listener to handle filter changes
  filterInput.addEventListener('input', () => {
    const filterValue = filterInput.value.toLowerCase();

    // Loop through the input elements and show/hide based on the filter
    const inputElements = inputContainer.children;

    for (let i = 0; i < inputElements.length; i++) {
      const element = /** @type {HTMLElement} */ (inputElements[i]);
      const id = element.id.toLowerCase();

      element.style.display = id.includes(filterValue) ? 'block' : 'none';
    }
  });
}

function attachReset(tabId = 0) {
  const btnReset = document.getElementById('btnReset');
  btnReset?.addEventListener('click', () => {
    // @ts-ignore
    chrome.tabs.sendMessage(tabId, {
      action: 'reset-variables',
    });
  });
}

function loadUI(response, tabs) {
  const variables = response ? response.variables : null;

  const cssVarList = /** @type {HTMLElement} */ (
    document.getElementById('variable-list')
  );

  if (!variables) {
    cssVarList.textContent = 'No CSS variables found.';
    return;
  }

  // Loop through the variables and display them
  for (let [name, value] of variables) {
    // Create a div to display the variable
    const cssVarContainer = document.createElement('div');
    cssVarContainer.className = 'variable-item';
    cssVarContainer.id = name;

    // Create a span for the variable name
    const cssVarName = document.createElement('span');
    cssVarName.className = 'variable-name';
    cssVarName.textContent = name;
    cssVarContainer.appendChild(cssVarName);

    // Create a span for the variable value
    const cssVarValue = document.createElement('input');
    cssVarValue.type = 'color';
    cssVarValue.className = 'variable-value';
    cssVarValue.style.backgroundColor = value;
    cssVarValue.value = value;
    cssVarContainer.appendChild(cssVarValue);

    // Append the variable item div to the variable list
    cssVarList.appendChild(cssVarContainer);
  }

  // Update the color preview div
  const divColorPreview = /** @type {HTMLElement} */ (
    document.getElementById('color-preview')
  );
  const updateColorPreview = () => {
    const inputValueList = Array.from(
      /** @type {NodeListOf<HTMLInputElement>} */
      (document.querySelectorAll('.variable-value'))
    );

    const colorValues = inputValueList.map((input) => input.value);
    divColorPreview.style.background = `linear-gradient(to right, ${colorValues.join(
      ', '
    )})`;
  };

  // Add event listeners to the variable value spans for updating
  const inputValueList = /** @type {HTMLInputElement[]} */ (
    Array.from(document.querySelectorAll('.variable-value'))
  );

  inputValueList.forEach((input) => {
    input.addEventListener('change', (e) => {
      updateColorPreview();

      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'update-variable',
        name: input.previousSibling?.textContent,
        value: input.value,
      });
    });
  });

  updateColorPreview();
  attachFilter();
  attachReset(tabs[0].id);
}

// Query the active tab to get the CSS variables
// @ts-ignore
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // @ts-ignore
  chrome.tabs.sendMessage(
    tabs[0].id,
    {
      action: 'get-variables',
    },
    (response) => loadUI(response, tabs)
  );
});

// Query the active tab to get the CSS variables
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.executeScript(tabs[0].id, { code: "getComputedStyle(document.documentElement).getPropertyValue(null)" }, function (result) {

//   });
// });
