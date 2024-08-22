document.addEventListener('DOMContentLoaded', () => {
  const scrapeList = document.getElementById('scrapeList');

  // Fetch the professor data from local storage
  chrome.storage.local.get('professors', (data) => {
    const professors = data.professors || [];

    scrapeList.innerHTML = ''; // Clear previous results

    professors.forEach(prof => {
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
