function createPopup(profName, rating, wouldTakeAgain, difficulty) {
  let popup = document.createElement('div');
  popup.style.position = 'absolute';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.padding = '10px';
  popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  popup.style.zIndex = '1000';
  popup.innerHTML = `
    <strong>${profName}</strong><br>
    Rating: ${rating}<br>
    Would Take Again: ${wouldTakeAgain}<br>
    Difficulty: ${difficulty}
  `;
  return popup;
}

function findProfessors() {
  let professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
  professors.forEach(prof => {
    let profName = prof.innerText.trim();
    chrome.runtime.sendMessage({ action: "fetchRating", profName: profName }, response => {
      if (response && response.rating) {
        let popup = createPopup(profName, response.rating, response.wouldTakeAgain, response.difficulty);
        document.body.appendChild(popup);

        // Position the popup above the professor div
        let rect = prof.getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY - popup.offsetHeight}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;

        // Show the popup when the professor div is hovered
        prof.addEventListener('mouseover', () => {
          popup.style.display = 'block';
        });

        // Hide the popup when the professor div is not hovered
        prof.addEventListener('mouseout', () => {
          popup.style.display = 'none';
        });
      }
    });
  });
}

window.onload = findProfessors;
