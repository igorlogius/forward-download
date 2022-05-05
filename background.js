
browser.browserAction.setBadgeBackgroundColor({color: 'white'});
browser.browserAction.setBadgeText({text: "off" });

let online=false;

async function handleCreated(info) {
    if(online){
        console.log('handleCreated:', info.id, info.url);

        try {
            browser.downloads.cancel(info.id);
        }catch(e) {
            console.log(`Error: ${e}`);
        }

        try {
            const resp =  await browser.runtime.sendNativeMessage("fwdl", info);
            console.log("Received " + resp);
        }catch(e) {
            console.log(`Error: ${e}`);
        }

    }
}

async function handleClick(tab) {

  // toggle state
  online = !online
  browser.browserAction.setBadgeText({tabId: tab.id, text: (online?"on":"off") });
}

browser.downloads.onCreated.addListener(handleCreated);
browser.browserAction.onClicked.addListener(handleClick);


