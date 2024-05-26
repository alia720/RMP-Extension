document.addEventListener('DOMContentLoaded', function() {
    let scrapeListButton = document.getElementById('scrapeList');

    scrapeListButton.addEventListener('click', async () => {
        try {
            // Receive current active tab of the window
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Check if the URL is restricted
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
                console.error('Cannot execute script on restricted URL:', tab.url);
                alert('Cannot scrape this page. Please navigate to a different page.');
                return;
            }

            // Exec script to parse list of divs
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: scrapeListFromPage,
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error('Script injection failed: ' + chrome.runtime.lastError.message);
                    return;
                }
                if (results && results[0] && results[0].result) {
                    displayDivs(results[0].result);
                }
            });
        } catch (error) {
            console.error('Error executing script:', error);
        }
    });

    function scrapeListFromPage() {
        let divs = document.querySelectorAll('div');
        let divTexts = [];
        divs.forEach(div => divTexts.push(div.innerText));
        return divTexts;
    }

    function displayDivs(divTexts) {
        let ul = document.getElementById('scrapeList');
        ul.innerHTML = ''; // Clear any existing list items
        divTexts.forEach(text => {
            let li = document.createElement('li');
            li.textContent = text;
            ul.appendChild(li);
        });
    }
});
