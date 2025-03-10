let goEtsy = document.getElementById("goEtsy")
let launch = document.getElementById("launch")

let urlCheck;
chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    urlCheck = tab[0].url
    if (urlCheck.includes('https://www.etsy.com/')) {
        goEtsy.style.display = "none"
        launch.style.display = "block"
    }
    else {
        goEtsy.style.display = "block"
        launch.style.display = "none"
    }

})


//// login or not logic======>
goEtsy.addEventListener("click", () => {
    if (urlCheck.includes('https://www.etsy.com/')) {

    }
    else {
        chrome.tabs.create({
            active: true,
            url: "https://www.etsy.com/"
        })
    }
})

let msgSend = () => {
    if (urlCheck.includes('/listing/')) {
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
}
launch.addEventListener("click", () => {
    msgSend()
})


