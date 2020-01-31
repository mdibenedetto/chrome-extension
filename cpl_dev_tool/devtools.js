const PANEL_PAGE = 'panel.html';

chrome.devtools.panels.create("CPL DEV TOOL",
    "",
    PANEL_PAGE,
    panel => {
        console.log("hello from callback");
    }); 