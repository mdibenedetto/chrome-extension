document.addEventListener('DOMContentLoaded', load, false);

let selectedDomain = "";

function load() {
    const btnClean = document.getElementById('btnClean');
    btnClean.addEventListener('click', cleanUp, false);

    const btnOptions = document.getElementById('btnOptions');
    btnOptions.addEventListener('click', openOptions, false);

    const txtDomainName = document.getElementById('txtDomainName');
    chrome.storage.sync.get({ domain: '' }, ({ domain }) => {

        if (domain) {
            selectedDomain = domain;
            txtDomainName.innerText = domain;
        } else {
            btnClean.style.display = 'none';
        }
    });
}

function openOptions() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("views/options/options.html"));
    }
}


function removeCookies(cookies) {

    const removeAllCookies = (cookies) => {
        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            console.log(cookie);
            chrome.cookies.remove({
                url: "https://" + cookie.domain + cookie.path,
                name: cookie.name
            });
        }
    }

    chrome.cookies.getAll({ domain: selectedDomain }, cookies => {
        removeAllCookies(cookies);
    });
}

function removeLocalStorage() {

    chrome.storage.local.clear();
    // const removeLocalStorageByKey = key =>
    //     chrome.storage.local.remove(key, function() {
    //         const error = chrome.runtime.lastError;
    //         if (error) {
    //             console.error(error);
    //         }
    //     })
    // get all keys
    // chrome.storage.sync.get(null, function(items) {    
    //     debugger  
    //     removeLocalStorageByKey(items.domain)
    // });
}

function cleanUp() {
    const MESSAGE = `Are you sure you want to delete all info for The domain ${  selectedDomain  }?`;

    if (!confirm(MESSAGE)) {
        return console.log('Action "Remove Cookies" was canceled')
    }

    chrome.cookies.getAll({ domain: selectedDomain }, cookies => {
        removeCookies(cookies);
    });

    removeLocalStorage();
}