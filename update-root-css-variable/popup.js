// @ts-check

console.log(`<< Popup.js >>`);

function attachFilter() {
  // Get the filter input element
  const filterInput = /** @type {HTMLInputElement} */ (
    document.getElementById('filter-input')
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

      if (id.includes(filterValue)) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  });
}

function loadUI(response, tabs) {
  const variables = response ? response.variables : null;

  const cssVarList = /** @type {HTMLElement} */ (
    document.getElementById('variable-list')
  );
  const divColorPreview = /** @type {HTMLElement} */ (
    document.getElementById('color-preview')
  );

  if (!variables) {
    cssVarList.textContent = 'No CSS variables found.';
    return;
  }

  // Loop through the variables and display them
  for (let [name, value] of variables) {
    // const value = getComputedStyle(document.documentElement).getPropertyValue(
    //   name
    // );

    // Create a div to display the variable
    const cssVarContainer = document.createElement('div');
    cssVarContainer.className = 'variable-item';
    cssVarContainer.id = name;

    // Create a span for the variable name
    const cssVarName = document.createElement('span');
    cssVarName.className = 'variable-name';
    cssVarName.textContent = name;

    // Create a span for the variable value
    const cssVarValue = document.createElement('input');
    cssVarValue.type = 'color';
    cssVarValue.className = 'variable-value';
    cssVarValue.style.backgroundColor = value;
    cssVarValue.textContent = value;
    cssVarValue.value = value;

    // Append the name and value spans to the variable item div
    cssVarContainer.appendChild(cssVarName);
    cssVarContainer.appendChild(cssVarValue);

    // Append the variable item div to the variable list
    cssVarList.appendChild(cssVarContainer);
  }

  // Update the color preview div
  const updateColorPreview = () => {
    const rootVariables = Array.from(
      document.getElementsByClassName('variable-value')
    );
    const colorValues = rootVariables.map((variable) => variable.textContent);
    divColorPreview.style.background = `linear-gradient(to right, ${colorValues.join(
      ', '
    )})`;
  };

  // Add event listeners to the variable value spans for updating
  const variableValues = Array.from(
    document.getElementsByClassName('variable-value')
  );
  variableValues.forEach((element) => {
    const variable = /** @type {HTMLElement} */ (element);

    variable.addEventListener('change', function (e) {
      const target = /** @type {HTMLElement} */ (e.currentTarget);

      target.textContent = target.textContent?.trim() || '';

      updateColorPreview();

      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateVariable',
        name: variable.previousSibling?.textContent,
        value: variable.value || variable.textContent,
      });
    });
  });

  updateColorPreview();
  attachFilter();
}

// Query the active tab to get the CSS variables
// @ts-ignore
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // @ts-ignore
  chrome.tabs.sendMessage(
    tabs[0].id,
    {
      action: 'getVariables',
    },
    (response) => loadUI(response, tabs)
  );
});

// Query the active tab to get the CSS variables
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.executeScript(tabs[0].id, { code: "getComputedStyle(document.documentElement).getPropertyValue(null)" }, function (result) {

//   });
// });
