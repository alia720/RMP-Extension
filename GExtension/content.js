function findProfessors() {
    let professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');  // Adjust the selector to match the actual school website
    professors.forEach(prof => {
      let profName = prof.innerText;
      chrome.runtime.sendMessage({action: "fetchRating", profName: profName}, response => {
        if (response && response.rating) {
          let ratingElement = document.createElement('span');
          ratingElement.textContent = ` (Rating: ${response.rating})`;
          prof.appendChild(ratingElement);
        }
      });
    });
  }
  
  window.onload = findProfessors;