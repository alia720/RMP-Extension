console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProfessors") {
    console.log("Scraping professors...");

    const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
    const profNames = Array.from(professors).map(prof => prof.innerText.trim());
    console.log("Professor names:", profNames);

    const fetchProfessorData = async (profName) => {
      try {
        const response = await fetch(`http://localhost:3000/getRating?profName=${encodeURIComponent(profName)}`);
        const data = await response.json();
        return { name: profName, ...data };
      } catch (error) {
        console.error(`Error fetching data for ${profName}:`, error);
        return { name: profName, rating: "N/A", wouldTakeAgain: "N/A", difficulty: "N/A" };
      }
    };

    const fetchAllProfessors = async () => {
      const results = await Promise.all(profNames.map(fetchProfessorData));
      sendResponse({ professors: results });
    };

    fetchAllProfessors();
    return true; // Will respond asynchronously.
  }
});
