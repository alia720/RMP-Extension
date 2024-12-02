chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchRating") {
    fetch(`http://localhost:3000/getRating?profName=${encodeURIComponent(request.profName)}`)
      .then(response => response.json())
      .then(data => sendResponse(data))
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ error: 'Failed to fetch data' });
      });
    return true; // Keep the message channel open for sendResponse
  }
});
