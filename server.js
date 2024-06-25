const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/getRating', async (req, res) => {
  const profName = req.query.profName;
  console.log(`Received request for professor: ${profName}`);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const searchURL = `https://www.ratemyprofessors.com/search/professors/1416?q=${encodeURIComponent(profName)}`;
    console.log(`Navigating to: ${searchURL}`);

    await page.goto(searchURL);

    const data = await page.evaluate(() => {
      const ratingElement = document.querySelector('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.icXUyq');
      const rating = ratingElement ? ratingElement.innerText : 'N/A';

      const wouldTakeAgainElement = Array.from(document.querySelectorAll('.CardFeedback__CardFeedbackItem-lq6nix-1.fyKbws'))
        .find(el => el.textContent.includes('would take again'));
      const wouldTakeAgain = wouldTakeAgainElement ? wouldTakeAgainElement.querySelector('.CardFeedback__CardFeedbackNumber-lq6nix-2.hroXqf').innerText : 'N/A';

      const difficultyElement = Array.from(document.querySelectorAll('.CardFeedback__CardFeedbackItem-lq6nix-1.fyKbws'))
        .find(el => el.textContent.includes('level of difficulty'));
      const difficulty = difficultyElement ? difficultyElement.querySelector('.CardFeedback__CardFeedbackNumber-lq6nix-2.hroXqf').innerText : 'N/A';

      return { rating, wouldTakeAgain, difficulty };
    });

    console.log(`Scraped data: ${JSON.stringify(data)}`);

    await browser.close();
    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
