 document.addEventListener('DOMContentLoaded', restore_options);

 const body = document.querySelector('body');
 body.addEventListener('click', ()=> txtDomainName.focus());

 const btnSave = document.getElementById('btnSave');
 btnSave.addEventListener('click', save_options);

 const txtDomainName = document.getElementById('txtDomainName');

 function save_options() {
     const domain = txtDomainName.value.trim();
     chrome.storage.sync.set({ domain }, () => console.log('Domain ' + domain));
 }

 function restore_options() { 
     const defaultDomain = '';
     chrome.storage.sync.get({ domain: defaultDomain }, items =>
         txtDomainName.value = items.domain
     );
 }