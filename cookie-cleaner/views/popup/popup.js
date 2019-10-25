document.addEventListener('DOMContentLoaded', load, false);

let selectedDomain = "";

function load() {
    const btnClean = document.getElementById('btnClean');
    btnClean.addEventListener('click', removeCookies, false);

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

function removeCookies() {
    chrome.cookies.getAll({ domain: selectedDomain }, cookies => {
        const MESSAGE = `The domain ${  selectedDomain  } has ${  cookies.length  } cookies.`;
        const MESSAGE_2 = `\r\n Are you sure you want to delete them?`;

        if (cookies.length === 0) {
            return alert(MESSAGE)
        } else if (!confirm(MESSAGE + MESSAGE_2)) {
            return console.log('Action "Remove Cookies" was canceled')
        }
        console.log('Action "Remove Cookies" is started...')

        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            console.log(cookie);

            chrome.cookies.remove({
                url: "https://" + cookie.domain + cookie.path,
                name: cookie.name
            });
        }
    });
}