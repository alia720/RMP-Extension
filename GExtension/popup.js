document.getElementById('scrapeButton').addEventListener('click', async () => {
    const profName = "Professor Name"; // Replace with the actual professor name or logic to get it
    try {
        const response = await fetch(`http://localhost:3000/getRating?profName=${encodeURIComponent(profName)}`);
        const data = await response.json();

        if (data) {
            const scrapeList = document.getElementById('scrapeList');
            scrapeList.innerHTML = ''; // Clear previous results

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${profName}</strong><br>
                Rating: ${data.rating}<br>
                Would Take Again: ${data.wouldTakeAgain}<br>
                Difficulty: ${data.difficulty}
            `;
            scrapeList.appendChild(li);
        }
    } catch (error) {
        console.error('Error fetching professor data:', error);
    }
});
