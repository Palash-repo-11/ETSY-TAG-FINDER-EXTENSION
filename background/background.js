// console.log("background js is ready")
chrome.runtime.onInstalled.addListener((details) => {
    let search = null;
    let urlC = "";
    chrome.storage.local.set({ search, urlC, })
    installedNotification(details.reason)
})

chrome.tabs.onUpdated.addListener((tabId, changedInfo, tab) => {
    // console.log(tab);
    let urls = tab.url
    let search1 = domainsDetails(urls)
    chrome.storage.local.get(["search", "urlC"], (result) => {
        if (result.urlC !== urls) {
            chrome.tabs.sendMessage(tabId, { msg: "start" }, () => {
                // console.log("message send", tabId);
            })
        }
        if (urls.includes('https://www.etsy.com/')) {
            chrome.storage.local.set({ search: search1, urlC: urls })
        }
    })


})

/*
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        let urls = tab.url
        let search2 = domainsDetails(urls)
        chrome.storage.local.get(["search", "urlC"], (result) => {
            if (result.urlC !== urls) {
                chrome.tabs.sendMessage(activeInfo.tabId, { msg: "start" }, () => {
                    // console.log("message send", activeInfo.tabId);
                })
            }
            if (urls.includes('https://www.etsy.com/')) {
                chrome.storage.local.set({ search: search2, urlC: urls })
            }
        })

    })

})
*/
const domainsDetails = (url) => {
    let urls = new URL(url);
    let params = urls.searchParams;

    let qResult = null;
    let clickKeyResult = null;

    params.forEach((value, name) => {
        if (name === 'q') {
            qResult = value;
        } else if (name === "click_key") {
            let a = value.trim().split(":");
            clickKeyResult = Number.parseInt(a[1]);
        }
    });

    if (qResult !== null) {
        return qResult;
    } else if (clickKeyResult !== null) {
        return clickKeyResult;
    }

    return null;
}

let msgSend = () => {
    chrome.storage.local.get(["urlC"], (res) => {
        let url = res.urlC
        if (url.includes('/listing/')) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { message: 'productsearch' });
            });
        }
        else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { message: 'menusearch' });
            });
        }
    })
}
chrome.runtime.onMessage.addListener((message, senser, sendResponce) => {
    // console.log(message);
    if (message.mes === "refBtn-clicked") {
        msgSend()
    }
})

const installedNotification = (msg) => {
    chrome.notifications.create(
        "noti",
        {
            type: "basic",
            iconUrl: chrome.runtime.getURL("ETSY.jpg"),
            title: "Image Downloader for AliExpress Alibaba™",
            message: `${msg} successfully`,
        })
}