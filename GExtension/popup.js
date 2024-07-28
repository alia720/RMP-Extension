document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrapeButton');
    const scrapeList = document.getElementById('scrapeList');
  
    scrapeButton.addEventListener('click', () => {
      console.log("Scrape button clicked");
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "scrapeProfessors" }, (response) => {
          console.log("Received response", response);
  
          scrapeList.innerHTML = ''; // Clear previous results
  
          response.professors.forEach(prof => {
            const li = document.createElement('li');
            li.innerHTML = `
              <strong>${prof.name}</strong><br>
              Rating: ${prof.rating}<br>
              Would Take Again: ${prof.wouldTakeAgain}<br>
              Difficulty: ${prof.difficulty}
            `;
            scrapeList.appendChild(li);
          });
        });
      });
    });
  });
  