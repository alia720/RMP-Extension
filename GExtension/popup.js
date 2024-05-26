let scrapeList = document.getElementById
('scrapeList');

scrapeList.addEventListener("click", async () => {

    // Receive current active tab of window

    let [tab] = await chrome.tabs.query({active:
        true, currentWindow:true});


    // Exec script to parse list
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeListFromPage,
    });

})


function scrapeListFromPage(){
    
}