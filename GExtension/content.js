console.log("Content script loaded");

// Create a popup div for displaying professor data
const popup = document.createElement('div');
popup.className = 'popup'; // Apply the class from CSS
document.body.appendChild(popup);

// Function to show popup
const showPopup = (event, content) => {
  popup.innerHTML = content;
  popup.style.top = `${event.pageY + 10}px`;
  popup.style.left = `${event.pageX + 10}px`;
  popup.style.display = 'block';
};

// Function to hide popup
const hidePopup = () => {
  popup.style.display = 'none';
};

// Function to fetch professor data with caching
const fetchProfessorData = (profName) => {
  return new Promise((resolve, reject) => {
    // Check if data is already in local storage
    chrome.storage.local.get([profName], (result) => {
      if (result[profName]) {
        console.log(`Using cached data for ${profName}`);
        resolve(result[profName]);
      } else {
        // If not in storage, fetch from the server
        console.log(`Fetching data for ${profName}`);
        chrome.runtime.sendMessage({ action: "fetchRating", profName: profName }, (response) => {
          if (response.error) {
            console.error(`Error fetching data for ${profName}:`, response.error);
            resolve({ name: profName, rating: "N/A", wouldTakeAgain: "N/A", difficulty: "N/A" });
          } else {
            const data = { name: profName, ...response };
            // Store the fetched data in local storage
            chrome.storage.local.set({ [profName]: data });
            resolve(data);
          }
        });
      }
    });
  });
};

// Function to add hyperlinks to professor names
const addHyperlinksToProfessors = () => {
  const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
  professors.forEach(prof => {
    const professorName = prof.innerText.trim();
    if (professorName) {
      // Save the original title
      const originalTitle = prof.getAttribute('title');

      // Create a hyperlink
      const link = document.createElement('a');
      link.href = '#'; // Prevent default behavior
      link.innerText = professorName;
      
      // Fetch professor data on mouseover and show the popup
      link.addEventListener('mouseover', (event) => {
        // Temporarily clear the title to prevent the default tooltip
        prof.removeAttribute('title');

        // Show "Loading..." while fetching data
        showPopup(event, 'Loading...');

        fetchProfessorData(professorName).then(data => {
          showPopup(event, `
            <strong>${data.name}</strong><br>
            Rating: ${data.rating}<br>
            Would Take Again: ${data.wouldTakeAgain}<br>
            Difficulty: ${data.difficulty}
          `);
        });
      });

      // Restore the title and hide the popup when mouse leaves the link
      link.addEventListener('mouseout', () => {
        prof.setAttribute('title', originalTitle);
        hidePopup();
      });

      // Prevent default click behavior
      link.addEventListener('click', (event) => {
        event.preventDefault();
      });

      // Replace the text node with the link
      prof.innerHTML = ''; // Clear current content
      prof.appendChild(link);
    }
  });
};

// Function to fetch all professors and add hyperlinks
const fetchAllProfessors = async () => {
  try {
    const professors = document.querySelectorAll('div.rightnclear[title="Instructor(s)"]');
    console.log("Found professors:", professors);

    if (professors.length === 0) {
      console.log("No professors found with the given selector.");
      return;
    }

    addHyperlinksToProfessors(); // Add hyperlinks to the professors
  } catch (error) {
    console.error('Error fetching all professors:', error);
  }
};

// Using Mutation Observer to watch for DOM changes as professor names are added later
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
