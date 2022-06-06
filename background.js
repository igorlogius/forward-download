/* global browser */

browser.browserAction.setBadgeBackgroundColor({color: 'white'});
browser.browserAction.setBadgeText({text: "off" });

let online=false;

async function handleCreated(info) {
    if(online){
        //console.log('handleCreated:', info.id, info.url);

        try {
            browser.downloads.cancel(info.id);
        }catch(e) {
            console.log(`Error: ${e}`);
        }

        // ref. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/Cookie
        // >>>
        let cookie_query = {
            firstPartyDomain: null // include both types of cookies
        };
        /*
        if(info.url){
            let tmp = new URL(info.url);
            if( tmp.protocol === 'http:' || tmp.protocol === 'https:' ){
                if(tmp.hostname){
                    cookie_query["domain"] = tmp.hostname;
                }
            }

        }
        */
        if(info.cookieStoreId) { cookie_query["storeId"] = info.cookieStoreId }
        //console.log(JSON.stringify(cookie_query,null,4));

        const cookies = (await browser.cookies.getAll(cookie_query)).map( (c) => {
                    return {
                         name: c.name
                        ,value: c.value
                        ,domain: c.domain
                        ,hostOnly: c.hostOnly
                        ,httpOnly: c.httpOnly
                        ,path: c.path
                        ,sameSite: c.sameSite
                    };
                });

        // <<< cookies

        const data = { info, cookies };
        //console.log(JSON.stringify(data,null,4));

        try {
            const resp =  await browser.runtime.sendNativeMessage("fwdl", data);
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

