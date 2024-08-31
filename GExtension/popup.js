document.addEventListener('DOMContentLoaded', () => {
  const scrapeList = document.getElementById('scrapeList');

  // Fetch all stored data from local storage
  chrome.storage.local.get(null, (data) => {
    const keys = Object.keys(data);
    
    scrapeList.innerHTML = ''; // Clear previous results

    if (keys.length === 0) {
      const li = document.createElement('li');
      li.innerText = 'No professors found.';
      scrapeList.appendChild(li);
    } else {
      keys.forEach(key => {
        const prof = data[key];
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${prof.name}</strong><br>
          Rating: ${prof.rating}<br>
          Would Take Again: ${prof.wouldTakeAgain}<br>
          Difficulty: ${prof.difficulty}
        `;
        scrapeList.appendChild(li);
      });
    }
  });
});
