console.log("Content script loaded");

// Function to create a hyperlink for professor names
const addHyperlinksToProfessors = () => {
  const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
  professors.forEach(prof => {
    const professorName = prof.innerText.trim();
    if (professorName) {
      // Create a hyperlink
      const link = document.createElement('a');
      link.href = '#'; // Prevent default behavior
      link.innerText = professorName;
      
      // Add click event to log the div or open it in the console
      link.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Professor div:', prof);
        console.log('Professor name:', professorName);
      });

      // Replace the text node with the link
      prof.innerHTML = ''; // Clear current content
      prof.appendChild(link);
    }
  });
};

const fetchProfessorData = (profName) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "fetchRating", profName: profName }, (response) => {
      if (response.error) {
        console.error(`Error fetching data for ${profName}:`, response.error);
        resolve({ name: profName, rating: "N/A", wouldTakeAgain: "N/A", difficulty: "N/A" });
      } else {
        resolve({ name: profName, ...response });
      }
    });
  });
};

const fetchAllProfessors = async () => {
  try {
    const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
    console.log("Found professors:", professors);

    if (professors.length === 0) {
      console.log("No professors found with the given selector.");
      return;
    }

    addHyperlinksToProfessors(); // Add hyperlinks to the professors (for future update of pop up hovering)

    const profNames = Array.from(professors).map(prof => prof.innerText.trim());
    console.log("Professor names:", profNames);

    if (profNames.length === 0) {
      console.log("No professor names extracted.");
      return;
    }

    const results = await Promise.all(profNames.map(fetchProfessorData));
    console.log("Fetched data:", results);

    chrome.storage.local.set({ professors: results });
  } catch (error) {
    console.error('Error fetching all professors:', error);
  }
};

// Using Mutation Observer to watch for DOM changes as proferssor names are added a while later
const observeProfessors = () => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
        if (professors.length > 0) {
          fetchAllProfessors();
          observer.disconnect(); // Stop observing once professors are fetched
          break;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

// Start observing after the window has fully loaded
window.addEventListener('load', observeProfessors);
