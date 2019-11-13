var console = chrome.extension.getBackgroundPage().console;

let txtFilter = document.getElementById('txtFilter');
txtFilter.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) { //"Enter" key  
        event.preventDefault();
        btnGo.click();
    }
});

let KEY_NAME = 'last-value';

chrome.storage.sync.get(KEY_NAME, function(result) {
    txtFilter.value = result[KEY_NAME] || '';
    txtFilter.select();
});

function saveData(value) {
    chrome.storage.sync.set({
        [KEY_NAME]: value
    }, function() {
        console.log('Value is set to ' + value);
    });
}

txtFilter.onchange = function({ target }) {
    saveData(target.value);
};

let btnGo = document.getElementById('btnGo');
btnGo.onclick = (element) => {
    let value = txtFilter.value;

    chrome.tabs.query({ active: true, currentWindow: true },
        function(tabs) {
            const code = `

            value='${value}';
            selector = '';
            
            function setFilterStyle(target, bgColor, color){
                target.style.backgroundColor = bgColor;
                target.style.color = color;
            }

            document.querySelectorAll('.TK a[style*="color: red"]')
            .forEach(t=> setFilterStyle(t, '', '') );
    
                     
            selector = '.TK a[title*="${value}"]';

            if(value){
                targets = document.querySelectorAll(selector);
                targets.forEach(t=> setFilterStyle(t, 'yellow', 'red'));
                
                if(targets.length > 0){
                    targets[0].focus();
                    document.querySelector('.nH.bkL').focus();
                } 
            }

        `;
            chrome.tabs.executeScript(tabs[0].id, { code });
        });
};